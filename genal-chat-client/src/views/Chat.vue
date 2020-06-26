<template>
  <div class="chat">
    <GenalHeader></GenalHeader>
    聊天窗{{ myname }}
    <textarea id="msg" rows="10" cols="40"></textarea>
    <button id="btn">留言</button>
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
  // @ts-ignore
  io: any = window.io;
  async created() {
    //实例化websocket
    const chat1 = this.io.connect('http://localhost:3000')

    chat1.on('connect',(res:any)=>{
      console.log('连接成功'+ res)
    })
    let chat2 = this.io.connect('http://localhost:3000');

    setInterval(()=>{
      chat2.emit('message',0,'client2发送的消息')
    },1000)
    // @ts-ignore
    chat1.on('message',(res)=>{
      console.log('client1 收到消息' + res)
    })
    // @ts-ignore
    chat2.on('message',(res)=>{
      console.log('client2 收到消息' + res)
    })
  }
}
</script>
<style lang="scss" scoped>
.chat {
}
</style>
