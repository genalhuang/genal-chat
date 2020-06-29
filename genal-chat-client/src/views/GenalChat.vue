<template>
  <div class="chat">
    <div class='chat-part1'>
      <genal-tool :user='user'></genal-tool>
    </div>
    <div class='chat-part2'>
      <genal-group
        :groups="groups"
        :group="group"
        @changeGroup="changeGroup"
      ></genal-group>
    </div>
    <div class='chat-part3'>
      <div class='chat-header'>
        <a-input v-model='group' placeholder="输入任意id作为群名称"></a-input>
        <a-button @click='addGroupUser(group)'>加入群组</a-button>
      </div>
      <div class='chat-group'>{{group}}</div>
      <div v-if='user.name'>
        <genal-message
        :messages='messages'
        @sendMessage='sendMessage'
        ></genal-message>
      </div>
      <genal-login @login="addUser" v-if='!user.name'></genal-login>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import GenalLogin from '@/components/GenalLogin.vue'
import GenalMessage from '@/components/GenalMessage.vue'
import GenalTool from '@/components/GenalTool.vue'
import GenalGroup from '@/components/GenalGroup.vue'
import * as api from '@/api/apis/index';
import { mapMutations, mapGetters } from 'vuex'
import io from 'socket.io-client'

@Component({
  components: {
    GenalLogin,
    GenalMessage,
    GenalTool,
    GenalGroup
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    ...mapMutations(['setUserInfo'])
  }
})
export default class GenalChat extends Vue {
  userClient: any = null;
  chatClient: any = null;
  groupClient: any = null;
  group: string = 'public'
  groups: GroupMessage[] = [];
  user: User = {
    name: '',
    password: '',
    avatar: 'aaaa.png',
  };
  messages: Chat[] = [];
  message: string = '';

  created() {
    this.handleChatEvents();
    this.handleGroupEvents();
    // @ts-ignore
    this.user = this.userInfo
    this.getGroups();
  }

  handleGroupEvents() {
    this.groupClient = io('/group');
    this.groupClient.on('connect', () => {
      console.log('群组socket连接成功');
      this.groupClient.on('addGroupUser',(res: Group) => {
        this.$message.success(`群${res.group},加入用户${res.name}`)
      })
    });
  }

  async addUser(user: User) {
    this.user = user;
    await api.addUser(user);
    //@ts-ignore
    this.setUserInfo(user);
    this.getGroups()
  }

  handleChatEvents() {
    this.chatClient = io('/chat');
    this.chatClient.on('connect', () => {
      console.log('聊天socket连接成功');
      // 获取聊天消息
      this.getMessages();
      // 监听消息事件
      this.chatClient.on('message', (res: any) => {
        console.log('message',res)
        this.setGroupMessage(res)
      });
    });
  }

  setGroupMessage(message: Chat) {
    this.messages.push(message);
    // 更新群框框的最新消息
    for(let i=0;i<this.groups.length;i++) {
      if(this.groups[i].group === message.group) {
        this.$set(this.groups,i,{
          group: message.group,
          name: message.name,
          newMessage: message.message
        })
      }
    }
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
    console.log(this.messages[this.messages.length-1])
  }

  // 用户加入某群
  addGroupUser(group: string) {
    this.group = group;
    // 聊天socket加入该群
    this.chatClient.emit('addGroupUser', {
      group: group,
      name: this.user.name
    })
    // 群组socket加入该群
    this.groupClient.emit('addGroupUser', {
      group: group,
      name: this.user.name
    })
    // 重新获取一遍消息
    this.getMessages()
    // 去重添加进群组框
    this.addGroups()
  }

  addGroups() {
    let add = true;
    for(let i=0;i<this.groups.length;i++) {
      if(this.groups[i].group === this.group) {
        add = false;
      }
    }
    if(add) {
      this.groups.push({
        newMesage: '',
        name: '',
        group: this.group
      })
    }
  }

  async getGroups() {
    let { data } = await api.getGroups(this.user.name)
    for(let key of data) {
      delete key.name
      this.addGroupUser(key.group)
    }
    this.groups = data;
    console.log(this.groups)
  }

  changeGroup(group: string) {
    this.group = group;
    // 重新获取一遍消息
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
  box-shadow: 6px 10px 10px #999;
  display: flex;
  border-radius: 5px;
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
    .chat-header {
      display: flex;
      top: 50px;
      z-index: 99;
      position: fixed;
    }
    .chat-group {
      height: 53px;
      border-bottom: 1px solid #ccc;
      line-height: 50px;
      font-weight: bold;
    }
  }
}
</style>
