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
    <div class="message-frame" ref="messages" :style="{ opacity: messageOpacity }">
      <a-icon type="sync" spin class="message-frame-loading" v-if="showLoading" />
      <template v-for="item in pagingMessage">
        <div class="message-frame-message" :key="item.userId + item.time" :class="{ 'text-right': item.userId === user.userId }">
          <genal-avatar :data="item"></genal-avatar>
          <div>
            <div class="message-frame-text" v-html="_parseText(item.content)" v-if="item.messageType === 'text'"></div>
            <div class="message-frame-image" v-if="item.messageType === 'image'">
              <viewer>
                <img :src="'api/static/' + item.content" alt="" :style="getImageStyle(item.content)" />
              </viewer>
            </div>
          </div>
        </div>
      </template>
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
        <a-icon class="messagte-tool-icon" type="appstore" />
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
  @chatModule.Getter('activeRoom') activeRoom: Group & Friend;
  @chatModule.Getter('groupGather') groupGather: GroupGather;
  @chatModule.Getter('userGather') userGather: FriendGather;

  message: string = '';
  loading: boolean = false;
  messageDom: Element;
  pagingMessage: Array<GroupMessage | FriendMessage> = [];
  messageCount: number = 15;
  messageOpacity: number = 0;
  lastTime: number = 0;

  mounted() {
    this.initPaste();
  }

  @Watch('activeRoom', { deep: true })
  changeActiveRoom() {
    this.loading = false;
    this.messageOpacity = 0;
    this.messageCount = 15;
    this.getPagingMessage();
    this.initScroll();
    this.scrollToBottom();
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

  initScroll() {
    let that = this;
    setTimeout(() => {
      this.messageDom = this.$refs.messages as Element;
      this.messageDom.addEventListener('scroll', this.handleScroll);
    }, 0);
  }

  handleScroll(event: any) {
    if (event.currentTarget) {
      if (this.messageDom.scrollTop === 0) {
        setTimeout(() => {
          this.messageCount += 15;
          this.getPagingMessage();
        }, 60);
      }
    }
  }

  /**
   * 滚动到底部
   */
  scrollToBottom() {
    setTimeout(() => {
      this.messageDom.scrollTop = this.messageDom.scrollHeight;
      this.messageOpacity = 1;
    }, 0);
  }

  /**
   * 获取分页消息
   */
  getPagingMessage() {
    if (!this.activeRoom.messages) {
      return (this.pagingMessage = []);
    }
    if (this.activeRoom.messages.length < this.messageCount) {
      this.loading = false;
      return (this.pagingMessage = this.activeRoom.messages);
    }
    this.loading = true;
    this.pagingMessage = this.activeRoom.messages.slice(this.activeRoom.messages.length - this.messageCount);
    if (this.messageDom && this.messageCount != 15) {
      setTimeout(() => {
        this.messageDom.scrollTop = 65;
      }, 20);
    }
  }

  get showLoading() {
    return this.loading && this.activeRoom.messages && this.activeRoom.messages.length;
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
    this.scrollToBottom();
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
  .message-frame {
    height: calc(100% - 115px);
    overflow: auto;
    position: relative;
    .text-right {
      text-align: right !important;
      .avatar {
        justify-content: flex-end;
      }
    }
    .message-frame-loading {
      margin: 10px auto;
      font-size: 20px;
      padding: 8px;
      border-radius: 50%;
      background-color: rgb(0, 0, 0, 0.8);
    }
    .message-frame-message {
      text-align: left;
      margin: 10px 20px;
      .message-frame-text,
      .message-frame-image {
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
      .message-frame-image {
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
  line-height: 45px;
  font-size: 22px;
  cursor: pointer;
  background-color: skyblue;
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
