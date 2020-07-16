<template>
  <div class="avatar" v-if='userGather[data.userId]'>
    <a-popover v-if='data.userId != user.userId && !friendGather[data.userId]'>
      <div slot="content" class='avatar-card'>
        <a-avatar icon="user" :size='60' :src="userGather[data.userId].avatar" />
        <div>{{userGather[data.userId].username}}</div>
        <a-button @click='addFriend(data.userId)'>添加好友</a-button>
      </div>
      <img type="primary" class='avatar-img' :src="userGather[data.userId].avatar" alt="">
    </a-popover>
    <a-avatar v-else icon="user" :src="userGather[data.userId].avatar" />
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
  @chatModule.Getter('userGather') userGather: FriendGather;
  @chatModule.Getter('friendGather') friendGather: FriendGather;
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
  height: 35px;
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
.avatar-card {
  display: flex;
  font-weight: bold;
  flex-direction: column;
  align-items: center;
  > div {
    margin: 4px;
  }
}
</style>
