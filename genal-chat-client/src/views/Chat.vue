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
  async created() {
    //实例化websocket
    var ws: WebSocket = new WebSocket('ws://localhost:3001');
    var $btn: Element = document.querySelector('#btn') as Element;
    var $msg: Element = document.querySelector('#msg') as Element;
    var $list: Element = document.querySelector('#msglist') as Element;

    wsEvent();
    //执行事件
    function wsEvent() {
      //收到服务端发来的数据
      ws.onmessage = (msg) => {
        console.log(msg.data, 111);
        $list.innerHTML += msg.data + '</br>';
      };
      ws.onclose = () => {
        //如果连接中断，重新连接
        reconnect();
      };
      ws.onerror = () => {
        //如果连接中断，重新连接
        reconnect();
      };
      setInterval(() => {
        ws.send('shabi');
      }, 1000);
    }

    function reconnect() {
      //重新连接
      if (ws.readyState === 2 || ws.readyState === 3) {
        ws = new WebSocket('ws://localhost:8099');
        wsEvent();
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.chat {
}
</style>
