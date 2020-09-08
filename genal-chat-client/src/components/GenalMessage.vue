<template>
  <div class="message">
    <div class="message-header">
      <div v-if="activeRoom">
        <div v-if="groupGather[activeRoom.groupId]" class="message-header-text">
          {{ groupGather[activeRoom.groupId].groupName }}
          <genal-active type='group'></genal-active>
        </div>
        <div v-else class="message-header-text">
          {{ userGather[activeRoom.userId].username }}
          <genal-active type='friend'></genal-active>
        </div>
      </div>
    </div>
    <div class="message-main" :style="{ opacity: messageOpacity }">
      <div class="message-content">
        <div v-if="activeRoom">
          <a-icon type="sync" spin class="message-content-loading" v-if="showLoading" />
          <template v-for="item in pagingMessage">
            <div class="message-content-message" :key="item.userId + item.time" :class="{ 'text-right': item.userId === user.userId }">
              <genal-avatar :data="item"></genal-avatar>
              <div>
                <div class="message-content-text" v-html="_parseText(item.content)" v-if="item.messageType === 'text'"></div>
                <div class="message-content-image" v-if="item.messageType === 'image'" :style="getImageStyle(item.content)">
                  <viewer>
                    <img :src="'api/static/' + item.content" alt="" />
                  </viewer>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
    <div class="message-input" v-if="activeRoom">
      <a-popover placement="topLeft" trigger="hover" class="message-popver">
        <template slot="content">
          <a-tabs default-key="1" size="small">
            <a-tab-pane key="1" tab="Emoji">
              <genal-emoji @addEmoji="addEmoji"></genal-emoji>
            </a-tab-pane>
            <a-tab-pane key="2" tab="工具">
              <div class="message-tool-item">
                <a-upload :show-upload-list="false" :before-upload="beforeImgUpload">
                  <div class="message-tool-contant">
                    <img src="~@/assets/photo.png" class="message-tool-item-img" alt="" />
                    <div class="message-tool-item-text">图片</div>
                  </div>
                </a-upload>
              </div>
            </a-tab-pane>
          </a-tabs>
        </template>
        <div class="messagte-tool-icon">😃</div>
      </a-popover>
      <a-input
        type="text"
        placeholder="say hello..."
        v-model="text"
        ref="input"
        autoFocus
        style="color:#000;"
        @pressEnter="throttle(sendMessage)"
      />
      <img class="message-input-button" @click="throttle(sendMessage)" src="~@/assets/send.png" alt="" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import GenalAvatar from './GenalAvatar.vue';
import GenalEmoji from './GenalEmoji.vue';
import GenalActive from './GenalActive.vue';
import { namespace } from 'vuex-class';
const chatModule = namespace('chat');
const appModule = namespace('app');
import { parseText } from '@/utils/common';

@Component({
  components: {
    GenalActive,
    GenalAvatar,
    GenalEmoji,
  },
})
export default class GenalMessage extends Vue {
  @appModule.Getter('user') user: User;
  @chatModule.State('activeRoom') activeRoom: Group & Friend;
  @chatModule.Getter('groupGather') groupGather: GroupGather;
  @chatModule.Getter('userGather') userGather: FriendGather;

  text: string = '';
  loading: boolean = false;
  messageDom: HTMLElement;
  messageContentDom: HTMLElement;
  pagingMessage: Array<GroupMessage | FriendMessage> = [];
  messageCount: number = 30;
  messageOpacity: number = 0;
  lastTime: number = 0;
  lastMessagePosition: number = 0;

  mounted() {
    this.initPaste();
    this.messageDom = document.getElementsByClassName('message-main')[0] as HTMLElement;
    this.messageContentDom = document.getElementsByClassName('message-content')[0] as HTMLElement;
    this.messageDom.addEventListener('scroll', this.handleScroll);
  }

  get showLoading() {
    return this.loading && this.activeRoom.messages && this.activeRoom.messages.length;
  }

  /**
   * 点击房间进入此方法
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

  /**
   * 初始化分页消息
   */
  initPagingMessage() {
    if (!this.activeRoom.messages) {
      return (this.pagingMessage = []);
    }
    if (this.activeRoom.messages.length <= 30) {
      return (this.pagingMessage = this.activeRoom.messages);
    }
    this.pagingMessage = this.activeRoom.messages.slice(this.activeRoom.messages.length - 30);
  }

  handleScroll(event: Event) {
    if (event.currentTarget) {
      // 只有有消息且滚动到顶部时才进入
      if (this.messageDom.scrollTop === 0 && this.activeRoom.messages && this.activeRoom.messages.length > this.messageCount) {
        this.lastMessagePosition = this.messageContentDom.offsetHeight;
        this.loading = true;
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
      this.loading = false;
      if (this.activeRoom.messages.length < this.messageCount) {
        return (this.pagingMessage = this.activeRoom.messages);
      }
      this.pagingMessage = this.activeRoom.messages.slice(this.activeRoom.messages.length - this.messageCount);
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
        return (this.pagingMessage = this.activeRoom.messages);
      }
      this.pagingMessage = this.activeRoom.messages.slice(this.activeRoom.messages.length - this.messageCount);
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
   * 监听图片粘贴事件
   */
  initPaste() {
    document.addEventListener('paste', (event) => {
      let items = event.clipboardData && event.clipboardData.items;
      let url = window.URL || window.webkitURL;
      let file = null;
      if (items && items.length) {
        // 检索剪切板items
        for (var i = 0; i < items.length; i++) {
          if (items[i].type.indexOf('image') !== -1) {
            file = items[i].getAsFile();
            break;
          }
        }
      }
      if (file) {
        this.throttle(this.handleImgUpload, file);
      }
    });
  }

  /**
   * 消息发送节流
   */
  throttle(fn: Function, file?: File) {
    let nowTime = +new Date();
    if (nowTime - this.lastTime < 500) {
      return this.$message.error('消息发送太频繁！');
    }
    fn(file);
    this.lastTime = nowTime;
  }

  sendMessage() {
    if (!this.text.trim()) {
      this.$message.error('不能发送空消息!');
      return;
    }
    if (this.text.length > 500) {
      this.$message.error('消息太长!');
      return;
    }
    if (this.activeRoom.groupId) {
      this.$emit('sendMessage', { type: 'group', message: this.text, messageType: 'text' });
    } else {
      this.$emit('sendMessage', { type: 'friend', message: this.text, messageType: 'text' });
    }
    this.text = '';
  }

  /**
   * 添加emoji到input
   */
  addEmoji(emoji: string) {
    this.text += emoji;
    this.focusInput();
  }

  focusInput() {
    // @ts-ignore
    this.$refs.input.focus();
  }

  /**
   * 根据图片url设置图片框宽高, 注意是图片框
   */
  getImageStyle(src: string) {
    let isMobile = document.body.clientWidth <= 768;
    let arr = src.split('$');
    let width = Number(arr[2]);
    let height = Number(arr[3]);
    if (isMobile) {
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
   * 计算图片的比例
   */
  getImageSize(data: ImageSize) {
    let { width, height } = data;
    if (width > 335 || height > 335) {
      if (width > height) {
        height = 335 * (height / width);
        width = 335;
      } else {
        width = 335 * (width / height);
        height = 335;
      }
    }
    return {
      width,
      height,
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
   * 点击图片校验
   * @params file
   */
  beforeImgUpload(file: File) {
    this.throttle(this.handleImgUpload, file);
    return false;
  }

  /**
   * 图片消息发送
   * @params file
   */
  async handleImgUpload(imageFile: File) {
    const isJpgOrPng =
      imageFile.type === 'image/jpeg' || imageFile.type === 'image/png' || imageFile.type === 'image/jpg' || imageFile.type === 'image/gif';
    if (!isJpgOrPng) {
      return this.$message.error('请选择jpeg/jpg/png/gif格式的图片!');
    }
    const isLt1M = imageFile.size / 1024 / 1024 < 0.5;
    if (!isLt1M) {
      return this.$message.error('图片必须小于500K!');
    }
    let image = new Image();
    let url = window.URL || window.webkitURL;
    image.src = url.createObjectURL(imageFile);
    image.onload = () => {
      let imageSize: ImageSize = this.getImageSize({ width: image.width, height: image.height });
      this.$emit('sendMessage', {
        type: this.activeRoom.groupId ? 'group' : 'friend',
        message: imageFile,
        width: imageSize.width,
        height: imageSize.height,
        messageType: 'image',
      });
    };
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
    background-color: rgb(0, 0, 0, 0.3);
  }
  .message-main {
    height: calc(100% - 100px);
    overflow: auto;
    position: relative;
    .text-right {
      text-align: right !important;
      .avatar {
        justify-content: flex-end;
      }
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
        background-color: rgb(0, 0, 0, 0.2);
        padding: 6px;
        font-size: 16px;
        border-radius: 5px;
        text-align: left;
        word-break: break-word;
        margin-top: 4px;
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
  width: 40px;
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
  .message-header-text {
    width: 100px;
    margin: 0 auto;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
