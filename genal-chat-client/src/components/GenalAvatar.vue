<template>
  <div class="avatar" v-if='userGather[data.userId]'>
    <a-popover v-if='data.userId != user.userId'>
      <div slot="content">
        <a-button @click='addFriend(data.userId)'>添加好友</a-button>
      </div>
      <img type="primary" class='avatar-img' :src="userGather[data.userId].avatar" alt="">
    </a-popover>
    <img v-else type="primary" class='avatar-img' :src="userGather[data.userId].avatar" alt="">
    <span class='avatar-name'>{{ userGather[data.userId].username }}</span>
    <span class='avatar-time'>{{ formatTime(data.time) }}</span>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import * as api from '@/api/apis';
import { namespace } from 'vuex-class'
const chatModule = namespace('chat')
const appModule = namespace('app')

@Component
export default class GenalAvatar extends Vue {
  @Prop() data: User;
  @appModule.Getter('user') user: User;
  @chatModule.Getter('userGather') userGather: UserGather;
  @chatModule.Getter('socket') socket: any;

  addFriend(friendId: string) {
    this.socket.emit('addFriend', {
      userId: this.user.userId,
      friendId: friendId,
      createTime: new Date().valueOf()
    })
  }

  formatTime(time: number) {
    //@ts-ignore
    return this.$moment(time).format('HH:mm:ss')
  }
}
</script>
<style lang="scss" scoped>
.avatar {
  .avatar-img {
    width: 35px;
  }
  .avatar-name {
    font-weight: bold;
  }
  .avatar-time {
    font-size: 10px;
    color: rgb(139, 139, 139);
    margin-left: 5px;
  }
}
</style>
