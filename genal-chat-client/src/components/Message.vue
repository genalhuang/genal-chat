<template>
  <div class="message">
    <div class='message-frame'>
      <div class='message-frame-message' v-for="(item, index) in messages" :key="index">
        <div class='message-frame-name'>
          <span class='name'>{{ item.name }}</span>
          <span class='time'>{{ formatTime(item.time) }}</span>
        </div>
        <div class='message-frame-text'>{{ item.message }}</div>
      </div>
    </div>
    <div class='message-input'>
      <a-input type="text" v-model="message" @keyup.enter="sendMessage"></a-input>
      <a-button @click="sendMessage">提交</a-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import * as api from '@/api/apis';

@Component
export default class Message extends Vue {
  @Prop({default: () => []}) messages!: Chat[];
  message: string = '';
  messageDom: Element = document.getElementsByClassName('message-frame')[0];

  @Watch('messages')
  changeMessages() {
    setTimeout(() => {
      this.scrollToBottom()
    }, 0);
  }

  mounted() {
    this.messageDom = document.getElementsByClassName('message-frame')[0];
    this.scrollToBottom()
  }

  scrollToBottom() {
    this.messageDom.scrollTop=this.messageDom.scrollHeight;
  }

  sendMessage() {
    setTimeout(() => {
      this.scrollToBottom()
    }, 350);
    if(!this.message.trim()) {
      this.$message.error('不能发送空消息!')
      return
    }
    this.$emit('sendMessage', this.message)
    this.message = ''
  }

  formatTime(time: string) {
    if(!time.length) {
      return ''
    }
    //@ts-ignore
    return this.$moment(Number(time)).format('HH:mm:ss')
  }
}
</script>
<style lang="scss" scoped>
.message {
  overflow: hidden;
  height: 600px;
  display: flex;
  flex-direction: column;
  .message-frame {
    height: 450px;
    overflow: auto;
    position: relative;
    .message-frame-message {
      text-align: left;
      margin: 10px;
      .message-frame-name {
        font-size: 14px;
        .name {
          font-weight: bold;
        }
        .time {
          font-size: 10px;
          color: rgb(139, 139, 139);
          margin-left: 5px;
        }
      }
      .message-frame-text {
        display: inline-block;
        background-color: skyblue;
        padding: 5px 8px;
        font-size: 12px;
        border-radius: 10px;
        cursor: pointer;
        &:hover {
          box-shadow: 1px 1px 4px skyblue;
        }
      }
    }
  }
  .message-input {
    display: flex;
    flex-wrap: nowrap;
    position: absolute;
    width: 100%;
    bottom:0;
  }
}
</style>
