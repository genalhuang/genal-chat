<template>
  <div class="message" v-if="activeRoom">
    <div class="message-header" v-if="activeRoom">
      <div v-if="groupGather[activeRoom.groupId]">
        {{ groupGather[activeRoom.groupId].groupName }}
      </div>
      <div v-else>
        {{ userGather[activeRoom.userId].username }}
      </div>
    </div>
    <div class="message-main" ref="message" :style="{ opacity: messageOpacity }">
      <div ref="messageContent">
        <a-icon type="sync" spin class="message-content-loading" v-if="showLoading" />
        <template v-for="item in pagingMessage">
          <div class="message-content-message" :key="item.userId + item.time" :class="{ 'text-right': item.userId === user.userId }">
            <genal-avatar :data="item"></genal-avatar>
            <div>
              <div class="message-content-text" v-html="_parseText(item.content)" v-if="item.messageType === 'text'"></div>
              <div class="message-content-image" v-if="item.messageType === 'image'">
                <viewer>
                  <img :src="'api/static/' + item.content" alt="" :style="getImageStyle(item.content)" />
                </viewer>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
    <div class="message-input">
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
        v-model="message"
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
import { namespace } from 'vuex-class';
const chatModule = namespace('chat');
const appModule = namespace('app');
import { parseText } from '@/utils/common';

@Component({
  components: {
    GenalAvatar,
    GenalEmoji,
  },
})
export default class GenalMessage extends Vue {
  @appModule.Getter('user') user: User;
  @chatModule.State('activeRoom') activeRoom: Group & Friend;
  @chatModule.Getter('groupGather') groupGather: GroupGather;
  @chatModule.Getter('userGather') userGather: FriendGather;

  message: string = '';
  loading: boolean = false;
  messageDom: HTMLElement;
  messageContentDom: HTMLElement;
  pagingMessage: Array<GroupMessage | FriendMessage> = [];
  messageCount: number = 15;
  messageOpacity: number = 0;
  lastTime: number = 0;
  lastMessagePosition: number = 0;

  mounted() {
    this.initPaste();
  }

  get showLoading() {
    return this.loading && this.activeRoom.messages && this.activeRoom.messages.length;
  }

  @Watch('activeRoom')
  changeActiveRoom() {
    this.messageOpacity = 0;
    this.messageCount = 15;
    this.initPagingMessage();
    this.initScroll();
    this.scrollToBottom();
  }

  @Watch('activeRoom.messages', { deep: true })
  changeMessages() {
    console.log('message');
    this.addMessage();
  }

  /**
   * 初始化分页消息
   */
  initPagingMessage() {
    if (!this.activeRoom.messages) {
      return (this.pagingMessage = []);
    }
    if (this.activeRoom.messages.length <= 15) {
      return (this.pagingMessage = this.activeRoom.messages);
    }
    this.pagingMessage = this.activeRoom.messages.slice(this.activeRoom.messages.length - 15);
  }

  initScroll() {
    let that = this;
    setTimeout(() => {
      this.messageDom = this.$refs.message as HTMLElement;
      this.messageContentDom = this.$refs.messageContent as HTMLElement;
      this.messageDom.addEventListener('scroll', this.handleScroll);
    }, 0);
  }

  handleScroll(event: any) {
    if (event.currentTarget) {
      // 只有有消息且滚动到顶部时才进入
      if (this.messageDom.scrollTop === 0 && this.activeRoom.messages && this.activeRoom.messages.length > this.messageCount) {
        this.lastMessagePosition = this.messageContentDom.offsetHeight;
        this.loading = true;
        setTimeout(() => {
          this.messageCount += 15;
          this.getPagingMessage();
        }, 0);
      }
    }
  }

  /**
   * 获取分页消息
   */
  getPagingMessage() {
    if (this.activeRoom.messages) {
      this.messageOpacity = 0;
      setTimeout(() => {
        this.messageDom.scrollTop = this.messageContentDom.offsetHeight - this.lastMessagePosition;
        this.messageOpacity = 1;
      }, 0);
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
      ++this.messageCount;
      if (this.activeRoom.messages.length < this.messageCount) {
        return (this.pagingMessage = this.activeRoom.messages);
      }
      let length = this.activeRoom.messages.length
      // 新消息来了只有是自己发的消息和消息框本身在底部才会滚动到底部
      if(this.judgeScrollToBottom()) {
        this.scrollToBottom();
      }
      this.pagingMessage = this.activeRoom.messages.slice(this.activeRoom.messages.length - this.messageCount);
    }
  }

  /**
   * 判断是否应该滚动到底部
   */
  judgeScrollToBottom() {
    return this.activeRoom.messages[length-1].userId === this.user.userId || this.messageDom.scrollTop + this.messageDom.offsetHeight > this.messageContentDom.scrollHeight 
  }

  /**
   * 滚动到底部
   */
  scrollToBottom() {
    setTimeout(() => {
      this.messageDom.scrollTop = this.messageDom.scrollHeight;
      this.messageOpacity = 1;
    }, 10);
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
    if (!this.message.trim()) {
      this.$message.error('不能发送空消息!');
      return;
    }
    if (this.message.length > 500) {
      this.$message.error('消息太长!');
      return;
    }
    if (this.activeRoom.groupId) {
      this.$emit('sendMessage', { type: 'group', message: this.message, messageType: 'text' });
    } else {
      this.$emit('sendMessage', { type: 'friend', message: this.message, messageType: 'text' });
    }
    this.message = '';
  }

  /**
   * 添加emoji到input
   */
  addEmoji(emoji: string) {
    this.message += emoji;
    this.focusInput();
  }

  focusInput() {
    // @ts-ignore
    this.$refs.input.focus();
  }

  /**
   * 根据图片url设置消息框宽高
   */
  getImageStyle(src: string) {
    let arr = src.split('$');
    return {
      width: `${arr[2]}px`,
      height: `${arr[3]}px`,
    };
  }

  /**
   * 计算图片的比例
   */
  getImageSize(data: ImageSize) {
    let { width, height } = data;
    if (width > 350 || height > 350) {
      if (width > height) {
        height = 350 * (height / width);
      } else {
        width = 350 * (width / height);
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
    height: calc(100% - 115px);
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
        background-color: rgb(0, 200, 255, 0.4);
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
    width: 99%;
    margin-top: 10px;
    bottom: 10px;
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
  .message-input {
    bottom: 0 !important;
  }
  .message-frame {
    height: calc(100% - 102px) !important;
    .message-frame-image {
      width: 150px !important;
      height: inherit !important;
      img {
        cursor: pointer;
        width: 137px !important;
        height: inherit !important;
      }
    }
  }
}
</style>
