<template>
  <div class="chat">
    <GenalHeader></GenalHeader>
    聊天窗{{ myname }}
    <div v-if="isJoin">
      聊天室
      <div v-for="(item, index) in messages" :key="index">
        <span>{{ item.name + ' : ' + item.message }}</span>
      </div>
      <input type="text" v-model="message" /><button @click="sendMessage">提交</button>
    </div>
    <div v-else>
      用户名: <input type="text" v-model="user.name" /><br />
      密码: <input type="text" v-model="user.password" /><br />
      头像: <input type="text" v-model="user.avatar" /><br />
      <button @click="addUser">提交</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import GenalHeader from '@/components/GenalHeader.vue';
import * as api from '@/api/apis'

@Component({
  components: {
    GenalHeader,
  },
})
export default class Chat extends Vue {
  myname: string = '陈冠希';
  userClient: any = null;
  chatClient: any = null;
  isJoin: boolean = false;
  user: any = {
    name: '',
    password: '',
    avatar: 'aaaa.png',
  };
  messages: any = [];
  message: string = '';
  // @ts-ignore
  io: any = window.io;
  async created() {
    this.handleUserEvents();
    this.handleChatEvents()
  }

  handleUserEvents() {
    this.userClient = this.io.connect('http://localhost:3000/user');
    this.userClient.on('connect', (res: any) => {
      console.log('用户socket连接成功' + res);
      this.userClient.on('addUser', (res: any) => {
        console.log('addUser', res);
      });
    });
  }
  async addUser() {
    this.isJoin = true;
    let a = await api.addUser(this.user)
  }


  handleChatEvents() {
    this.chatClient = this.io.connect('http://localhost:3000/chat');
    this.chatClient.on('connect', (res: any) => {
      console.log('聊天socket连接成功' + res);
      this.chatClient.on('message', (res: any) => {
        this.messages.push(res)
      });
    });
  }
  async sendMessage() {
    let a = await api.sendChat({
      name: this.user.name,
      group: '/public',
      message: this.message
    })
  }
}
</script>
<style lang="scss" scoped>
.chat {
}
</style>
