<template>
  <div class="chat">
    <a-input v-model='group'></a-input>
    <a-button @click='addGroupUser'>加入群组</a-button>
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
import io from 'socket.io-client'

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
  groupClient: any = null;
  group: string = 'public'
  user: User = {
    name: '',
    password: '',
    avatar: 'aaaa.png',
  };
  messages: Chat[] = [];
  message: string = '';

  async created() {
    this.handleChatEvents();
    this.handleGroupEvents();
    // @ts-ignore
    this.user = this.userInfo
  }

  handleGroupEvents() {
    this.groupClient = io('/group');
    this.groupClient.on('connect', (res: any) => {
      console.log('群组socket连接成功' + res);
      this.groupClient.on('addGroupUser',(res: Group) => {
        this.$message.success(`群${this.group},加入用户${res.name}`)
      })
    });
  }

  async addUser(user: User) {
    this.user = user;
    await api.addUser(user);
    //@ts-ignore
    this.setUserInfo(user);
  }

  handleChatEvents() {
    this.chatClient = io('/chat', {
      query: {
        room: this.group
      }
    });
    this.chatClient.on('connect', (res: any) => {
      console.log('聊天socket连接成功' + res);
      this.chatClient.on('message', (res: any) => {
        this.messages.push(res);
      });
      // 获取聊天消息
      this.getMessages();
    });
  }

  sendMessage(message: string) {
    this.chatClient.emit('message', {
      name: this.user.name,
      group: this.group,
      message: message,
      time: new Date().getTime().toString()
    })

  }

  async getMessages() {
    let { data } = await api.getChat(this.group);
    this.messages = data;
    console.log(this.messages)
  }

  async addGroupUser() {
    await this.chatClient.emit('addGroupUser', {
      group: this.group,
      name: this.user.name
    })
    await this.groupClient.emit('addGroupUser', {
      group: this.group,
      name: this.user.name
    })
    this.getMessages()
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
  box-shadow: 6px 10px 10px #000;
  .chat-group {
    height: 50px;
    border-bottom: 1px solid #ccc;
    line-height: 50px;
    font-weight: bold;
  }
}
</style>
