<template>
  <div class="message">
    <div class="message-header">
      <div v-if="activeRoom">
        <div v-if="groupGather[activeRoom.groupId]" class="message-header-box">
          <span class="message-header-text">{{ groupGather[activeRoom.groupId].groupName }}</span>
          <a-icon type="sync" spin class="message-header-icon" v-if="dropped" />
          <genal-active type="group"></genal-active>
        </div>
        <div v-else class="message-header-box">
          <span>{{ userGather[activeRoom.userId].username }}</span>
          <a-icon type="sync" spin class="message-header-icon" v-if="dropped" />
          <genal-active type="friend"></genal-active>
        </div>
      </div>
    </div>
    <div class="message-main" :style="{ opacity: messageOpacity }">
      <div class="message-content">
        <div v-if="activeRoom">
          <div class="message-content-tips" v-if="MAX_MESSAGE_SIZE <= messageCount && MAX_MESSAGE_SIZE <= activeRoom.messages.length">
            最多只能查看最近500条消息~
            <!--            <a-button @click='getMoreMessage'>获取更多</a-button>-->
          </div>
          <template v-for="item in pagingMessages">
            <div class="message-content-message" :key="item.userId + item.time" :class="{ 'text-right': item.userId === user.userId }">
              <genal-avatar :data="item"></genal-avatar>
              <div>
                <div class="message-content-text" v-html="_parseText(item.content)" v-if="item.messageType === 'text'"></div>
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
    </div>
    <genal-input></genal-input>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import GenalAvatar from './GenalAvatar.vue';
import GenalEmoji from './GenalEmoji.vue';
import GenalActive from './GenalActive.vue';
import GenalInput from './GenalInput.vue';
import { namespace } from 'vuex-class';
const chatModule = namespace('chat');
const appModule = namespace('app');
import { parseText } from '@/utils/common';

@Component({
  components: {
    GenalActive,
    GenalAvatar,
    GenalEmoji,
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

  text: string = '';
  messageDom: HTMLElement;
  messageContentDom: HTMLElement;
  pagingMessages: Array<GroupMessage | FriendMessage> = [];
  messageCount: number = 30;
  messageOpacity: number = 0;
  lastMessagePosition: number = 0;
  MAX_MESSAGE_SIZE: number = 50;

  mounted() {
    this.messageDom = document.getElementsByClassName('message-main')[0] as HTMLElement;
    this.messageContentDom = document.getElementsByClassName('message-content')[0] as HTMLElement;
    this.messageDom.addEventListener('scroll', this.handleScroll);
  }

  /**
   * 点击切换房间进入此方法
   */
  @Watch('activeRoom')
  changeActiveRoom() {
    this.messageOpacity = 0;
    this.messageCount = 30;
    this.initPagingMessage();
    this.scrollToBottom();
  }

  /**
   * 新消息会进入此方法
   */
  @Watch('activeRoom.messages', { deep: true })
  changeMessages() {
    this.addMessage();
  }

  // 监听socket断连给出重连状态提醒
  @Watch('socket.disconnected') connectingSocket() {
    if (this.socket.disconnected) {
      this.set_dropped(true);
    }
  }

  /**
   * 初始化分页消息
   */
  initPagingMessage() {
    if (!this.activeRoom.messages) {
      return (this.pagingMessages = []);
    }
    if (this.activeRoom.messages.length <= 30) {
      return (this.pagingMessages = this.activeRoom.messages);
    }
    this.pagingMessages = this.activeRoom.messages.slice(this.activeRoom.messages.length - 30);
  }

  /**
   * 监听滚动事件
   */
  handleScroll(event: Event) {
    if (event.currentTarget) {
      // 只有有消息且滚动到顶部时才进入
      if (this.messageDom.scrollTop === 0 && this.activeRoom.messages && this.activeRoom.messages.length > this.messageCount) {
        this.lastMessagePosition = this.messageContentDom.offsetHeight;
        this.messageCount += 30;
        this.getPagingMessage();
      }
    }
  }

  /**
   * 获取分页消息
   */
  getPagingMessage() {
    if (this.activeRoom.messages) {
      this.messageOpacity = 0;
      this.$nextTick(() => {
        this.messageDom.scrollTop = this.messageContentDom.offsetHeight - this.lastMessagePosition;
        this.messageOpacity = 1;
      });
      if (this.activeRoom.messages.length < this.messageCount) {
        return (this.pagingMessages = this.activeRoom.messages);
      }
      this.pagingMessages = this.activeRoom.messages.slice(this.activeRoom.messages.length - this.messageCount);
    }
  }

  /**
   * 在分页信息的基础上来了新消息
   */
  addMessage() {
    if (this.activeRoom.messages) {
      // 新消息来了只有是自己发的消息和消息框本身在底部才会滚动到底部
      if (this.judgeScrollToBottom()) {
        this.scrollToBottom();
      }
      ++this.messageCount;
      if (this.activeRoom.messages.length < this.messageCount) {
        return (this.pagingMessages = this.activeRoom.messages);
      }
      this.pagingMessages = this.activeRoom.messages.slice(this.activeRoom.messages.length - this.messageCount);
    }
  }

  /**
   * 判断是否应该滚动到底部
   */
  judgeScrollToBottom() {
    let messages = this.activeRoom.messages;
    return (
      messages[messages.length - 1].userId === this.user.userId ||
      (this.messageDom && this.messageDom.scrollTop + this.messageDom.offsetHeight + 80 > this.messageContentDom.scrollHeight)
    );
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
}
</script>
<style lang="scss" scoped>
.message {
  overflow: hidden;
  height: 100%;
  position: relative;
  color: #fff;
  .message-header {
    height: 60px;
    line-height: 60px;
    background-color: rgb(0, 0, 0, 0.5);
    .message-header-icon {
      margin-left: 5px;
    }
  }
  .message-main {
    height: calc(100% - 100px);
    overflow: auto;
    position: relative;
    .message-content {
      .message-content-tips {
        color: skyblue;
        line-height: 50px;
      }
      .message-content-loading {
        margin: 10px auto;
        font-size: 20px;
        padding: 8px;
        border-radius: 50%;
        background-color: rgb(0, 0, 0, 0.8);
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
          background-color: rgb(0, 0, 0, 0.4);
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
      width: 110px;
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
</style>
