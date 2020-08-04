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
    <div class="message-frame" ref="messages">
      <a-icon type="sync" spin class="message-frame-loading" v-if="showLoading" />
      <template v-for="item in pagingMessage">
        <div class="message-frame-message" :key="item.userId + item.time" :class="{ 'text-right': item.userId === user.userId }">
          <genal-avatar :data="item"></genal-avatar>
          <div>
            <div class="message-frame-text" v-html="_parseText(item.content)" v-if="item.messageType === 'text'"></div>
            <div class="message-frame-image" v-if="item.messageType === 'image'">
              <viewer>
                <img :src="'static/' + item.content" alt="" :style="getImageStyle(item.content)" />
              </viewer>
            </div>
          </div>
        </div>
      </template>
    </div>
    <div class="message-input">
      <genal-emoji @addEmoji="addEmoji"></genal-emoji>
      <a-input
        type="text"
        placeholder="好好说话..."
        v-model="message"
        ref="input"
        autoFocus
        style="color:#000;"
        @pressEnter="sendMessage"
      />
      <img class="message-input-button" @click.self="sendMessage" src="~@/assets/send.png" alt="" />
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
  imageFile: File | null;

  mounted() {
    this.initPaste();
  }

  @Watch('activeRoom', { deep: true })
  changeActiveRoom() {
    this.messageCount = 15;
    this.loading = true;
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
        this.imageFile = file;
        let image = new Image();
        image.src = url.createObjectURL(this.imageFile);
        image.onload = () => {
          let imageSize: ImageSize = this.getImageSize({ width: image.width, height: image.height });
          this.$emit('sendMessage', {
            type: this.activeRoom.groupId ? 'group' : 'friend',
            message: this.imageFile,
            width: imageSize.width,
            height: imageSize.height,
            messageType: 'image',
          });
        };
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
        this.loading = true;
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
    this.pagingMessage = this.activeRoom.messages.slice(this.activeRoom.messages.length - this.messageCount);
    if (this.messageDom && this.messageCount != 15) {
      setTimeout(() => {
        this.messageDom.scrollTop = 65;
      }, 20);
    }
  }

  get showLoading() {
    return this.loading && this.activeRoom.messages;
  }

  sendMessage() {
    this.scrollToBottom();
    if (!this.message.trim()) {
      this.$message.error('不能发送空消息!');
      return;
    }
    if (this.activeRoom.groupId) {
      this.$emit('sendMessage', { type: 'group', message: this.message, messageType: 'text' });
    } else {
      this.$emit('sendMessage', { type: 'friend', message: this.message, messageType: 'text' });
    }
    this.message = '';
  }

  formatTime(time: number) {
    //@ts-ignore
    return this.$moment(time).format('HH:mm:ss');
  }

  /**
   * 添加emoji到input
   */
  addEmoji(emoji: string) {
    this.message += emoji;
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

  _parseText(text: string) {
    return parseText(text);
  }
}
</script>
<style lang="scss" scoped>
.message {
  overflow: hidden;
  height: 800px;
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
    transition: 1s all linear;
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
  padding: 0 50px 0 45px;
}
</style>
