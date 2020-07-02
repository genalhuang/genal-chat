<template>
  <div class="chat">测试页面</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import io from 'socket.io-client';

@Component
export default class Test extends Vue {
  a = {
    userId: '1',
    username: '余文乐',
  };
  b = {
    userId: '2',
    username: '陈冠希',
  };
  aclient: any;
  bclient: any;
  created() {
    let a = io.connect('/chat');
    a.on('connect', () => {
      console.log('a connect');
      a.on('addFriend', (res: any) => {
        if (res.code) {
          console.log(1111111,res);
        }
        res = res.data;
        if (res.friendId === this.a.userId) {
          console.log('a joinfrnend');
          a.emit('joinFriend', res);
        }
      });
      a.on('friendMessage', (res: any) => {
        if (res.code) {
          console.log(res);
        }
        res = res.data;
        if (res.to === this.a.userId) {
          console.log('a friendMessage', res);
        }
      });
    });
    this.aclient = a;
    setTimeout(() => {
      let b = io.connect('/chat');
      this.bclient = b;
      b.on('connect', () => {
        console.log('b connect');
        b.on('addFriend', (res: any) => {
          if (res.code) {
            console.log(res);
          }
          res = res.data;
          if (res.friendId === this.b.userId) {
            console.log('b joinfrnend');
            b.emit('joinFriend', res);
          }
        });
        b.on('friendMessage', (res: any) => {
          if (res.code) {
            console.log(res);
          }
          res = res.data;
          if (res.to === this.b.userId) {
            console.log('b friendMessage', res);
          }
        });
        b.emit('addFriend', {
          userId: this.b.userId,
          friendId: this.a.userId,
          createTime: new Date().valueOf(),
        });
      });
    });

    setInterval(() => {
     this.bclient.emit('joinFriend',{
      userId: this.b.userId,
      friendId: this.a.userId,
      createTime: new Date().valueOf()
    })
    this.aclient.emit('joinFriend', {
      userId: this.a.userId,
      friendId: this.b.userId,
      createTime: new Date().valueOf()
    })
      this.bclient.emit('friendMessage', {
        from: this.b.userId,
        to: this.a.userId,
        content: '我佛了 听得到吗',
        time: new Date().valueOf(),
      });
    }, 2000);

  }
}
</script>
<style lang="scss" scoped>
.chat {
}
</style>
