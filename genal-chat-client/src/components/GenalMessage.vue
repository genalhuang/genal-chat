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
    <div class='message-frame' ref='messages'>
      <a-icon type="sync" spin class='message-frame-loading' v-if='showLoading()' />
      <template v-for="(item, index) in pagingMessage">
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
import { Message } from 'ant-design-vue/types/message';
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
  loading: boolean = true
  messageDom: Element = document.getElementsByClassName('message-frame')[0];
  pagingMessage: Array<GroupMessage | FriendMessage> = [];
  messageCount: number = 15;

  @Watch('activeRoom', {deep: true})
  changeActiveRoom() {
    this.messageCount = 20
    this.loading = true;
    this.getPagingMessage()
    setTimeout(()=>{
      this.scrollToBottom()
    }, 0)
  }

  handleScroll(event:any) {
    if (event.currentTarget) {
      console.log("开始滚动",this.messageDom.scrollTop);
      if(this.messageDom.scrollTop === 0) {
        this.loading = true
        this.messageCount += 15;
        this.getPagingMessage()
      }
    }
  }

  getPagingMessage() {
    if(!this.activeRoom.messages) {
      return this.pagingMessage = []
    }
    if(this.activeRoom.messages.length < this.messageCount) {
      this.loading = false;
      return this.pagingMessage = this.activeRoom.messages
    } 
    this.pagingMessage = this.activeRoom.messages.slice(this.activeRoom.messages.length-this.messageCount)
    if(this.messageDom) {
      this.messageDom.scrollTop = 60;
    }
  }

  showLoading() {
    return this.loading && this.activeRoom.messages && this.activeRoom.messages.length > 1
  }

  scrollToBottom() {
    this.messageDom = document.getElementsByClassName('message-frame')[0];
    this.messageDom.addEventListener("scroll", this.handleScroll);
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
    transition: 1s all linear;
    .text-right {
      text-align: right!important;
      .avatar {
        justify-content: flex-end;
      }
    }
    .message-frame-loading {
      margin: 15px auto;
      font-size: 20px;
      padding: 8px;
      border-radius: 50%;
      background-color: rgb(0, 0, 0, .8);
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
