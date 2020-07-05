<template>
  <div class="chat">
    <div class='chat-part1'>
      <a-button @click='logout'>注销</a-button>
    </div>
    <div class='chat-part2'>
      <a-input v-model="user.username"></a-input>
      <genal-room
        @addGroup='addGroup'
        @joinGroup='joinGroup'
        @addFriend='addFriend'
        @setActiveRoom='setActiveRoom'
        :groups="groups"
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
import GenalJoin from '@/components/GenalJoin.vue'
import GenalRoom from '@/components/GenalRoom.vue'
import GenalMessage from '@/components/GenalMessage.vue'
import io from 'socket.io-client'
import { namespace } from 'vuex-class'
const appModule = namespace('app')
const chatModule = namespace('chat')
import { processReturn } from '@/utils/common.ts';

@Component({
  components: {
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
  @chatModule.Getter('activeRoom') activeRoom: any;
  @chatModule.Getter('groups') groups: any;
  @chatModule.Mutation('set_active_room') _setActiveRoom: Function;
  @chatModule.Action('connectSocket') connectSocket: Function;
  @chatModule.Action('getGroupAndMessages') getGroupAndMessages: Function;
  @chatModule.Action('getFriendAndMessages') getFriendAndMessages: Function;
  @chatModule.Action('getUserGather') getUserGather: Function;

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

  sendMessage(data: SendMessageDto) {
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
        friendId: this.activeRoom.friendId,
        content: data.message,
        time: new Date().valueOf()
      })
    }

  }

  addGroup(groupname: string) {
    this.socket.emit('addGroup', {
      userId: this.user.userId,
      groupname: groupname,
      createTime: new Date().valueOf()
    })
  }

  joinGroup(groupname: string) {
    console.log('gro',groupname)
    this.socket.emit('joinGroup', {
      userId: this.user.userId,
      groupname: groupname,
      createTime: new Date().valueOf()
    })
  }

  addFriend(friendId: string) {
    console.log(this.user)
    this.socket.emit('addFriend', {
      userId: this.user.userId,
      friendId: friendId,
      createTime: new Date().valueOf()
    })
  }

  setActiveRoom(room: FriendDto & GroupDto) {
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
