<template>
  <div class="chat">
    <a-button @click='logout'>注销</a-button>
    {{user}}
    {{groups}}
    <genal-join @regist='handleregist' @login="handlelogin" :showModal="showModal"></genal-join>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import GenalJoin from '@/components/GenalJoin.vue'
import { mapMutations, mapGetters } from 'vuex'
import io from 'socket.io-client'
import { namespace } from 'vuex-class'
const appModule = namespace('app')
const chatModule = namespace('chat')

@Component({
  components: {
    GenalJoin
  },
})
export default class GenalChat extends Vue {
  showModal = false;

  @appModule.Getter('user') user: User;
  @appModule.Mutation('clear_user') clearUser: Function;
  @appModule.Action('login') login: Function;
  @appModule.Action('regist') regist: Function;

  @chatModule.Getter('socket') socket: any;
  @chatModule.Getter('groups') groups: any;
  @chatModule.Action('connectSocket') connectSocket: Function;
  @chatModule.Action('getGroupAndMessages') getGroupAndMessages: Function;

  created() {
    if(!this.user.userId) {
      this.showModal = true;
    } else {
      this.handleJoin()
    }
  }

  mounted() {
    setTimeout(()=>{
    console.log(this.groups)
    },1000)

  }

  // 登录
  async handlelogin(user: User) {
    let {code, data} = await this.login(user)
    if(code) {
      this.$message.error(data)
      return;
    }
    this.$message.success('登录成功')
    // 进入系统事件
    this.handleJoin()
  }

  // 注册
  async handleregist(user: User) {
    let {code, data} = await this.regist(user)
    console.log(code,data)
    if(code) {
      this.$message.error(data)
      return;
    }
    this.$message.success('注册成功')

    // 进入系统事件
    this.handleJoin()
  }

  // 进入系统初始化事件
  async handleJoin() {
    this.showModal = false;
    this.connectSocket()
    await this.getGroupAndMessages()
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
