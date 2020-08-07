<template>
  <div class="avatar" v-if="userGather[data.userId]">
    <a-popover v-if="data.userId != user.userId && !friendGather[data.userId]">
      <div slot="content" class="avatar-card">
        <a-avatar :size="60" :src="userGather[data.userId].avatar" />
        <div>{{ userGather[data.userId].username }}</div>
        <a-button @click="addFriend(data.userId)" type="primary">添加好友</a-button>
      </div>
      <a-avatar class="avatar-img" :src="userGather[data.userId].avatar" />
    </a-popover>
    <a-avatar v-else class="avatar-img" :src="userGather[data.userId].avatar" />
    <span class="avatar-name">{{ userGather[data.userId].username }}</span>
    <span class="avatar-time">{{ _formatTime(data.time) }}</span>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import * as api from '@/api/apis';
import { namespace } from 'vuex-class';
const chatModule = namespace('chat');
const appModule = namespace('app');
import { formatTime } from '@/utils/common';

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
      createTime: new Date().valueOf(),
    });
  }

  _formatTime(time: number) {
    return formatTime(time);
  }
}
</script>
<style lang="scss" scoped>
.avatar {
  display: flex;
  align-items: center;
  height: 37px;
  .avatar-img {
    cursor: pointer;
    width: 35px;
    height: 35px;
  }
  .avatar-name {
    margin-left: 5px;
  }
  .avatar-time {
    font-size: 14px;
    color: rgba(219, 213, 213, 1);
    margin-left: 5px;
  }
}
.avatar-card {
  display: flex;
  font-size: 18px;
  flex-direction: column;
  align-items: center;
  > div {
    margin: 4px;
  }
}
</style>
