<template>
  <div class="chat">
    <GenalHeader></GenalHeader>
    聊天窗{{ myname }}
    <div v-if="isJoin">
      聊天室
      <div v-for="(item,index) in messages" :key="index">
        <span>{{item.user + " : " + item.message}}</span>
      </div>
      <input type="text" v-model="message"><button  @click="sendMessage">提交</button>
    </div>
    <div v-else>
      用户名: <input type="text" v-model="user.username"><br>
      密码: <input type="text" v-model="user.password"><br>
      头像: <input type="text" v-model="user.avatar"><br>
      <button @click="addUser">提交</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import GenalHeader from '@/components/GenalHeader.vue';

@Component({
  components: {
    GenalHeader,
  },
})
export default class Chat extends Vue {
  myname: string = '陈冠希';
  chat: any = null;
  isJoin: boolean = false;
  user: any = {
    username: '',
    password: '',
    avatar: 'aaaa.png'
  }
  messages: any = []
  message: string = ''
  // @ts-ignore
  io: any = window.io;
  async created() {
    this.chat = this.io.connect('http://localhost:3000')
    this.chat.on('connect',(res:any)=>{
      console.log('连接成功'+ res)

    })
    this.chat.on('addUser', (res:any) => {
      console.log('addUser', res)
    })
    this.chat.on('message', (res:any) => {
      console.log('message',res)
      this.messages.push(res)
    })
  }

  addUser() {
    this.isJoin  = true;
    this.chat.emit('addUser',this.user)
  }

  sendMessage() {
    console.log('asdf')
    this.chat.emit('message', {user: this.user.username, message: this.message})
  }
}
</script>
<style lang="scss" scoped>
.chat {
}
</style>
