<template>
  <div class="message">
    <div class='message-frame'>
      <div v-if='JSON.stringify(userGather) != "{}"'>
        <template v-for="(item, index) in activeRoom.messages">
          <div 
            class='message-frame-message' 
            :key="index"
            :class="{'text-right': item.userId === user.userId}"
          >
            <genal-avatar :data='item'></genal-avatar>
            <div class='message-frame-text'>{{ item.content }}</div>
          </div>
        </template>
      </div>
    </div>
    <div class='message-input'>
      <a-input type="text" v-model="message" @keyup.enter="sendMessage"></a-input>
      <a-button @click="sendMessage">发送</a-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import GenalAvatar from './GenalAvatar.vue'
import * as api from '@/api/apis';
import { namespace } from 'vuex-class'
const chatModule = namespace('chat')
const appModule = namespace('app')

@Component({
  components: {
    GenalAvatar
  }
})
export default class GenalMessage extends Vue {
  @appModule.Getter('user') user: User;
  @chatModule.Getter('activeRoom') activeRoom: GroupDto & FriendDto;
  @chatModule.Getter('userGather') userGather: UserGather;

  message: string = '';
  messageDom: Element = document.getElementsByClassName('message-frame')[0];

  @Watch('activeRoom.messages')
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
    if(this.activeRoom.groupId) {
      this.$emit('sendMessage', {type: 'group', message: this.message})
    } else {
      this.$emit('sendMessage', {type: 'friend', message: this.message})
    }
    this.message = ''
  }

  formatTime(time: number) {
    //@ts-ignore
    return this.$moment(time).format('HH:mm:ss')
  }
}
</script>
<style lang="scss" scoped>
.message {
  overflow: hidden;
  height: 600px;
  padding: 10px 0 10px 10px;
  display: flex;
  flex-direction: column;
  .message-frame {
    height: 490px;
    overflow: auto;
    position: relative;
    .text-right {
      text-align: right!important;
    }
    .message-frame-message {
      text-align: left;
      margin: 10px;
      .message-frame-name {
        font-size: 14px;
        margin-bottom: 3px;
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
    position: relative;
    width: 99%;
    margin-top: 10px;
    bottom: 0;
  }
}
</style>
