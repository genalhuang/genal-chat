<template>
  <div class="chat">
    <div class='chat-part1'>
      <genal-tool
        @logout='logout'
      ></genal-tool>
    </div>
    <div class='chat-part2'>
      <genal-room
        @addGroup='addGroup'
        @joinGroup='joinGroup'
        @addFriend='addFriend'
        @setActiveRoom='setActiveRoom'
      ></genal-room>
    </div>
    <div class='chat-part3'>
      <genal-message @sendMessage='sendMessage'></genal-message>
    </div>
    <genal-join @regist='handleregist' @login="handlelogin" :showModal="showModal"></genal-join>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import GenalTool from '@/components/GenalTool.vue'
import GenalJoin from '@/components/GenalJoin.vue'
import GenalRoom from '@/components/GenalRoom.vue'
import GenalMessage from '@/components/GenalMessage.vue'
import { namespace } from 'vuex-class'
const appModule = namespace('app')
const chatModule = namespace('chat')
import { processReturn } from '@/utils/common.ts';

@Component({
  components: {
    GenalTool,
    GenalJoin,
    GenalRoom,
    GenalMessage
  },
})
export default class GenalChat extends Vue {
  showModal = false;

  @appModule.Getter('user') user: User;
  @appModule.Mutation('clear_user') clearUser: Function;
  @appModule.Action('login') login: Function;
  @appModule.Action('regist') regist: Function;

  @chatModule.Getter('socket') socket: any;
  @chatModule.Getter('userGather') userGather: any;
  @chatModule.Getter('activeRoom') activeRoom: any;
  @chatModule.Mutation('set_active_room') _setActiveRoom: Function;
  @chatModule.Action('connectSocket') connectSocket: Function;
  @chatModule.Action('getGroupAndMessages') getGroupAndMessages: Function;
  @chatModule.Action('getFriendAndMessages') getFriendAndMessages: Function;

  created() {
    if(!this.user.userId) {
      this.showModal = true;
    } else {
      this.handleJoin()
    }
  }


  // 登录
  async handlelogin(user: User) {
    let res = await this.login(user)
    if(res) {
      // 进入系统事件
      this.handleJoin()
    }
  }

  // 注册
  async handleregist(user: User) {
    let res = await this.regist(user)
    if(res) {
      // 进入系统事件
      this.handleJoin()
    }
  }

  // 进入系统初始化事件
  async handleJoin() {
    this.showModal = false;
    this.connectSocket()
  }

  sendMessage(data: SendMessage) {
    console.log('sendMessage',data)
    if(data.type === 'group') {
      this.socket.emit('groupMessage', {
        userId: this.user.userId,
        groupId: this.activeRoom.groupId,
        content: data.message,
        time: new Date().valueOf()
      })
    } else {
      this.socket.emit('friendMessage', {
        userId: this.user.userId,
        friendId: this.activeRoom.userId,
        content: data.message,
        time: new Date().valueOf()
      })
    }

  }

  addGroup(groupName: string) {
    this.socket.emit('addGroup', {
      userId: this.user.userId,
      groupName: groupName,
      createTime: new Date().valueOf()
    })
  }

  joinGroup(groupId: string) {
    this.socket.emit('joinGroup', {
      userId: this.user.userId,
      groupId: groupId,
    })
    this.getGroupAndMessages()
  }

  addFriend(friendId: string) {
    console.log(this.user)
    this.socket.emit('addFriend', {
      userId: this.user.userId,
      friendId: friendId,
      createTime: new Date().valueOf()
    })
  }

  setActiveRoom(room: Friend & Group) {
    this._setActiveRoom(room)
  } 

  // 注销
  logout() {
    this.clearUser()
    this.$router.go(0)
  }
}
</script>
<style lang="scss" scoped>
.chat {
  max-width: 800px;
  width: 800px;
  height: 600px;
  position: relative;
  background-color: #fff;
  margin: auto 20px;
  box-shadow: 6px 10px 10px #999;
  display: flex;
  border-radius: 5px;
  .chat-header {
    position: absolute;
    display: flex;
    right: 0;
    top: -50px;
  }
  .chat-part1 {
    width: 65px;
    background-color: #151515;
  }
  .chat-part2 {
    width: 200px;
    background-color: #fff;
  }
  .chat-part3 {
    flex: 1;
    background-color: #fff;
    .chat-group {
      height: 53px;
      border-bottom: 1px solid #ccc;
      line-height: 50px;
      font-weight: bold;
    }
  }
}
</style>
