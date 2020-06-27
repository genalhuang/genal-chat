<template>
  <div class="chat">
    <div class='chat-group'>{{group}}</div>
    <div v-if='user.name'>
      <message 
      :messages='messages'
      @sendMessage='sendMessage'
      ></message>
    </div>
    <login @login="addUser" v-if='!user.name'></login>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Login from '@/components/Login.vue'
import Message from '@/components/Message.vue'
import * as api from '@/api/apis';
import { mapMutations, mapGetters } from 'vuex'

@Component({
  components: {
    Login,
    Message,
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    ...mapMutations(['setUserInfo'])
  }
})
export default class Chat extends Vue {
  userClient: any = null;
  chatClient: any = null;
  group: string = '小天才'
  user: User = {
    name: '',
    password: '',
    avatar: 'aaaa.png',
  };
  messages: Chat[] = [];
  message: string = '';
  // @ts-ignore
  io: any = window.io;

  async created() {
    this.handleUserEvents();
    this.handleChatEvents();
    // @ts-ignore
    this.user = this.userInfo
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

  async addUser(user: User) {
    this.user = user;
    await api.addUser(user);
    //@ts-ignore
    this.setUserInfo(user);
  }

  handleChatEvents() {
    this.chatClient = this.io.connect('http://localhost:3000/chat');
    this.chatClient.on('connect', (res: any) => {
      console.log('聊天socket连接成功' + res);
      this.chatClient.on('message', (res: any) => {
        this.messages.push(res);
      });
      // 获取聊天消息
      this.getMessages();
    });
  }

  async sendMessage(message: string) {
    await api.sendChat({
      name: this.user.name,
      group: this.group,
      message: message,
    });
  }

  async getMessages() {
    let { data } = await api.getChat(this.group);
    this.messages = data;
  }
}
</script>
<style lang="scss" scoped>
.chat {
  max-width: 800px;
  width: 800px;
  height: 600px;
  overflow: hidden;
  position: relative;
  background-color: #fff;
  margin: auto 20px;
  box-shadow: 1px 10px 10px #ccc;
  .chat-group {
    height: 50px;
    border-bottom: 1px solid #ccc;
    line-height: 50px;
    font-weight: bold;
  }
}
</style>
