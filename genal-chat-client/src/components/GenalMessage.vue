<template>
  <div class="message" v-if='activeRoom'>
    <div class="message-header" v-if='activeRoom'>
      <div v-if='groupGather[activeRoom.groupId]'> 
        {{groupGather[activeRoom.groupId].groupName}}
      </div>
      <div v-else>
        {{userGather[activeRoom.userId].username}}
      </div>
    </div>
    <div class='message-frame'>
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
    <div class='message-input'>
      <a-input type="text" placeholder="好好说话..." v-model="message" @keyup.enter="sendMessage" />
      <img class='message-input-button' @click="sendMessage" src="~@/assets/send.png" alt="">
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import GenalAvatar from './GenalAvatar.vue'
import { namespace } from 'vuex-class'
const chatModule = namespace('chat')
const appModule = namespace('app')

@Component({
  components: {
    GenalAvatar,
  }
})
export default class GenalMessage extends Vue {
  @appModule.Getter('user') user: User;
  @chatModule.Getter('activeRoom') activeRoom: Group & Friend;
  @chatModule.Getter('groupGather') groupGather: GroupGather;
  @chatModule.Getter('userGather') userGather: FriendGather;

  message: string = '';
  messageDom: Element = document.getElementsByClassName('message-frame')[0];

  @Watch('activeRoom.messages')
  changeMessages() {
    setTimeout(() => {
      this.scrollToBottom()
    }, 0);
  }

  @Watch('activeRoom')
  changeActiveRoom() {
    setTimeout(()=>{
      this.scrollToBottom()
    }, 0)
  }

  scrollToBottom() {
    this.messageDom = document.getElementsByClassName('message-frame')[0];
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
  height: 800px;
  position: relative;
  color: #fff;
  .message-header {
    height: 60px;
    line-height: 60px;
    background-color: rgb(0, 0, 0,.3);
  }
  .message-frame {
    height: calc(100% - 115px);
    overflow: auto;
    position: relative;
    .text-right {
      text-align: right!important;
      .avatar {
        justify-content: flex-end;
      }
    }
    .message-frame-message {
      text-align: left;
      margin: 10px 20px;
      .message-frame-text {
        display: inline-block;
        background-color: rgb(0, 200, 255, .4);
        padding: 5px 10px;
        font-size: 14px;
        border-radius: 5px;
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
</style>
