<template>
  <div class="message">
    <div class="message-header">
      <div class="message-header-box">
        <span class="message-header-text">{{ chatName }}</span>
        <a-icon type="sync" spin class="message-header-icon" v-if="dropped" />
        <genal-active v-if="groupGather[activeRoom.groupId]" type="group"></genal-active>
        <genal-active v-else type="friend"></genal-active>
      </div>
    </div>
    <transition name="loading">
      <div class="message-loading" v-if="spinning && !isNoData">
        <a-icon type="sync" spin class="message-loading-icon" />
      </div>
    </transition>
    <div class="message-main" :style="{ opacity: messageOpacity }">
      <div class="message-content">
        <transition name="noData">
          <div class="message-content-noData" v-if="isNoData">没有更多消息了~</div>
        </transition>
        <template v-for="item in activeRoom.messages">
          <div class="message-content-message" :key="item.userId + item.time" :class="{ 'text-right': item.userId === user.userId }">
            <genal-avatar :data="item"></genal-avatar>
            <div>
              <a class="message-content-text" v-if="_isUrl(item.content)" :href="item.content" target="_blank">{{ item.content }}</a>
              <div class="message-content-text" v-text="_parseText(item.content)" v-else-if="item.messageType === 'text'"></div>
              <div class="message-content-image" v-if="item.messageType === 'image'" :style="getImageStyle(item.content)">
                <viewer style="display:flex;align-items:center;">
                  <img :src="'api/static/' + item.content" alt="" />
                </viewer>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
    <genal-input></genal-input>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import GenalAvatar from './GenalAvatar.vue';
import GenalActive from './GenalActive.vue';
import GenalInput from './GenalInput.vue';
import * as api from '@/api/apis';
import { namespace } from 'vuex-class';
const chatModule = namespace('chat');
const appModule = namespace('app');
import { isUrl, parseText, processReturn } from '@/utils/common';

@Component({
  components: {
    GenalActive,
    GenalAvatar,
    GenalInput,
  },
})
export default class GenalMessage extends Vue {
  @appModule.Getter('user') user: User;
  @appModule.Getter('mobile') mobile: boolean;

  @chatModule.State('activeRoom') activeRoom: Group & Friend;
  @chatModule.Getter('socket') socket: SocketIOClient.Socket;
  @chatModule.Getter('dropped') dropped: boolean;
  @chatModule.Getter('groupGather') groupGather: GroupGather;
  @chatModule.Getter('userGather') userGather: FriendGather;
  @chatModule.Mutation('set_dropped') set_dropped: Function;
  @chatModule.Mutation('set_group_messages') set_group_messages: Function;
  @chatModule.Mutation('set_friend_messages') set_friend_messages: Function;
  @chatModule.Mutation('set_user_gather') set_user_gather: Function;

  text: string = '';
  needScrollToBottom: boolean = true;
  messageDom: HTMLElement;
  messageContentDom: HTMLElement;
  headerDom: HTMLElement;
  messageOpacity: number = 1;
  lastMessagePosition: number = 0;
  spinning: boolean = false;
  pageSize: number = 30;
  isNoData: boolean = false;
  lastTime: number = 0;

  mounted() {
    this.messageDom = document.getElementsByClassName('message-main')[0] as HTMLElement;
    this.messageContentDom = document.getElementsByClassName('message-content')[0] as HTMLElement;
    this.headerDom = document.getElementsByClassName('message-header-text')[0] as HTMLElement;
    this.messageDom.addEventListener('scroll', this.handleScroll);
    this.scrollToBottom();
  }

  get chatName() {
    if (this.groupGather[this.activeRoom.groupId]) {
      return this.groupGather[this.activeRoom.groupId].groupName;
    } else {
      return this.userGather[this.activeRoom.userId].username;
    }
  }

  /**
   * 点击切换房间进入此方法
   */
  @Watch('activeRoom')
  changeActiveRoom() {
    this.messageOpacity = 0;
    this.isNoData = false;
    // 聊天名过渡动画
    if (this.headerDom) {
      this.headerDom.classList.add('transition');
      setTimeout(() => {
        this.headerDom.classList.remove('transition');
      }, 400);
    }
    // 大数据渲染优化
    if (this.activeRoom.messages && this.activeRoom.messages.length > 30) {
      this.activeRoom.messages = this.activeRoom.messages.splice(this.activeRoom.messages.length - 30, 30) as GroupMessage[] &
        FriendMessage[];
    }
    this.scrollToBottom();
  }

  /**
   * 新消息会进入此方法
   */
  @Watch('activeRoom.messages', { deep: true })
  changeMessages() {
    if (this.needScrollToBottom) {
      this.addMessage();
    }
    this.needScrollToBottom = true;
  }

  // 监听socket断连给出重连状态提醒
  @Watch('socket.disconnected') connectingSocket() {
    if (this.socket.disconnected) {
      this.set_dropped(true);
    }
  }

  /**
   * 在分页信息的基础上来了新消息
   */
  addMessage() {
    if (this.activeRoom.messages) {
      // 新消息来了只有是自己发的消息和消息框本身在底部才会滚动到底部
      let messages = this.activeRoom.messages;
      if (
        messages[messages.length - 1].userId === this.user.userId ||
        (this.messageDom && this.messageDom.scrollTop + this.messageDom.offsetHeight + 100 > this.messageContentDom.scrollHeight)
      ) {
        this.scrollToBottom();
      }
    }
  }

  /**
   * 监听滚动事件
   */
  handleScroll(event: Event) {
    if (event.currentTarget) {
      // 只有有消息且滚动到顶部时才进入
      if (this.messageDom.scrollTop === 0) {
        this.lastMessagePosition = this.messageContentDom.offsetHeight;
        let messages = this.activeRoom.messages;
        if (messages && messages.length >= this.pageSize && !this.spinning) {
          this.getMoreMessage();
        }
      }
    }
  }

  /**
   * 消息获取节流
   */
  throttle(fn: Function, file?: File) {
    let nowTime = +new Date();
    if (nowTime - this.lastTime < 1000) {
      return this.$message.error('消息获取太频繁！');
    }
    fn(file);
    this.lastTime = nowTime;
  }

  /**
   * 获取更多消息
   * @params text
   */
  async getMoreMessage() {
    if (this.isNoData) {
      return false;
    }
    this.spinning = true;
    if (this.activeRoom.groupId) {
      await this.getGroupMessages();
    } else {
      await this.getFriendMessages();
    }
    this.$nextTick(() => {
      this.messageDom.scrollTop = this.messageContentDom.offsetHeight - this.lastMessagePosition;
      this.spinning = false;
      this.messageOpacity = 1;
    });
  }

  /**
   * 获取群聊消息
   */
  async getGroupMessages() {
    let groupId = this.activeRoom.groupId;
    let current = this.activeRoom.messages!.length;
    let currentMessage = this.activeRoom.messages ? this.activeRoom.messages : [];
    let data: PagingResponse = processReturn(
      await api.getGroupMessages({
        groupId,
        current,
        pageSize: this.pageSize,
      })
    );
    if (data) {
      if (!data.messageArr.length || data.messageArr.length < this.pageSize) {
        this.isNoData = true;
      }
      this.needScrollToBottom = false;
      this.set_group_messages([...data.messageArr, ...currentMessage]);
      for (let user of data.userArr) {
        if (!this.userGather[user.userId]) {
          this.set_user_gather(user);
        }
      }
    }
  }

  /**
   * 获取私聊消息
   */
  async getFriendMessages() {
    let userId = this.user.userId;
    let friendId = this.activeRoom.userId;
    let current = this.activeRoom.messages!.length;
    let currentMessage = this.activeRoom.messages ? this.activeRoom.messages : [];
    let data: PagingResponse = processReturn(
      await api.getFriendMessage({
        userId,
        friendId,
        current,
        pageSize: this.pageSize,
      })
    );
    if (data) {
      if (!data.messageArr.length || data.messageArr.length < this.pageSize) {
        this.isNoData = true;
      }
      this.needScrollToBottom = false;
      this.set_friend_messages([...data.messageArr, ...currentMessage]);
    }
  }

  /**
   * 滚动到底部
   */
  scrollToBottom() {
    this.$nextTick(() => {
      this.messageDom.scrollTop = this.messageDom.scrollHeight;
      this.messageOpacity = 1;
    });
  }

  /**
   * 根据图片url设置图片框宽高, 注意是图片框
   */
  getImageStyle(src: string) {
    let arr = src.split('$');
    let width = Number(arr[2]);
    let height = Number(arr[3]);
    if (this.mobile) {
      // 如果是移动端,图片最大宽度138, 返回值加12是因为设置的是图片框的宽高要加入padding值
      if (width > 138) {
        height = (height * 138) / width;
        width = 138;
        return {
          width: `${width + 12}px`,
          height: `${height + 12}px`,
        };
      }
    }
    return {
      width: `${width + 12}px`,
      height: `${height + 12}px`,
    };
  }

  /**
   * 文本转译/校验
   * @params text
   */
  _parseText(text: string) {
    return parseText(text);
  }

  /**
   * 是否URL
   * @params text
   */
  _isUrl(text: string) {
    return isUrl(text);
  }
}
</script>
<style lang="scss" scoped>
.message {
  overflow: hidden;
  height: 100%;
  position: relative;
  .message-header {
    height: 60px;
    line-height: 60px;
    z-index: 100;
    background-color: rgb(0, 0, 0, 0.6);
    .message-header-text {
      color: #fff;
    }
    .message-header-icon {
      margin-left: 5px;
    }
  }
  .message-loading {
    position: absolute;
    left: calc(50% - 18px);
    top: 60px;
    z-index: 99;
    .message-loading-icon {
      margin: 10px auto;
      font-size: 20px;
      padding: 8px;
      border-radius: 50%;
      background-color: rgb(0, 0, 0, 0.8);
    }
  }
  .message-main {
    height: calc(100% - 100px);
    overflow: auto;
    position: relative;
    .message-content {
      .message-content-noData {
        line-height: 50px;
      }
      .message-content-message {
        text-align: left;
        margin: 10px 20px;
        .message-content-text,
        .message-content-image {
          max-width: 600px;
          display: inline-block;
          overflow: hidden;
          margin-top: 4px;
          padding: 6px;
          background-color: rgba(0, 0, 0, 0.4);
          font-size: 16px;
          border-radius: 5px;
          text-align: left;
          word-break: break-word;
        }
        .message-content-image {
          max-height: 350px;
          max-width: 350px;
          img {
            cursor: pointer;
            max-width: 335px;
            max-height: 335px;
          }
        }
      }
      .text-right {
        text-align: right !important;
        .avatar {
          justify-content: flex-end;
        }
      }
    }
  }
  .message-input {
    display: flex;
    flex-wrap: nowrap;
    position: absolute;
    width: 100%;
    bottom: 0px;
    input {
      height: 40px;
    }
    .message-input-button {
      width: 30px;
      cursor: pointer;
      position: absolute;
      right: 10px;
      top: 4px;
    }
  }
}

//输入框样式
.ant-input {
  padding: 0 50px 0 50px;
}
// 消息工具样式
.messagte-tool-icon {
  position: absolute;
  left: 0;
  top: 0;
  width: 50px;
  height: 40px;
  text-align: center;
  line-height: 42px;
  font-size: 16px;
  cursor: pointer;
  z-index: 99;
}
.message-tool-item {
  width: 0px;
  height: 240px;
  cursor: pointer;
  .message-tool-contant {
    width: 50px;
    padding: 5px;
    border-radius: 5px;
    transition: all linear 0.2s;
    .message-tool-item-img {
      width: 40px;
    }
    .message-tool-item-text {
      text-align: center;
      font-size: 10px;
    }
    &:hover {
      background: rgba(135, 206, 235, 0.6);
    }
  }
}

// 移动端样式
@media screen and (max-width: 768px) {
  .message-main {
    .message-content-image {
      img {
        cursor: pointer;
        max-width: 138px !important;
        height: inherit !important;
      }
    }
  }
}
@media screen and (max-width: 500px) {
  .message-header-box {
    .message-header-text {
      display: block;
      width: 36%;
      margin: 0 auto;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .message-header-icon {
      position: absolute;
      top: 17px;
      right: 60px;
      font-size: 25px;
    }
  }
}
.loading-enter-active {
  transition: all 0.3s ease;
}
.loading-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.loading-enter,
.loading-leave-to {
  transform: translateY(-30px);
  opacity: 0;
}

.noData-enter-active,
.noData-leave-active {
  transition: opacity 1s;
}
.noData-enter,
.noData-leave-to {
  opacity: 0;
}

.transition {
  display: inline-block;
  animation: transition 0.4s ease;
}
@keyframes transition {
  0% {
    transform: translateY(-40px);
    opacity: 0;
  }
  60% {
    transform: translateY(10px);
    opacity: 0.6;
  }
  100% {
    transform: translateY(0px);
    opacity: 1;
  }
}
</style>
