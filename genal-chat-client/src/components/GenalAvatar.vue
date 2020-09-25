<template>
  <div class="avatar" v-if="userGather[data.userId]">
    <a-popover v-if="data.userId !== user.userId" trigger="click">
      <div slot="content" class="avatar-card">
        <a-avatar :size="60" :src="userGather[data.userId].avatar" />
        <div>{{ userGather[data.userId].username }}</div>
        <a-button v-if="user.role === 'admin'" style="margin-bottom: 5px;" @click="deleteUser(data.userId)" type="primary">
          删除用户
        </a-button>
        <a-button @click="_setActiveRoom(data.userId)" type="primary" v-if="friendGather[data.userId]">进入私聊</a-button>
        <a-button @click="addFriend(data.userId)" type="primary" v-else>添加好友</a-button>
      </div>
      <a-avatar class="avatar-img" :src="userGather[data.userId].avatar" />
    </a-popover>
    <a-avatar v-else class="avatar-img" :src="userGather[data.userId].avatar" />
    <div>
      <span class="avatar-name">{{ userGather[data.userId].username }}</span>
      <span class="avatar-time" v-if="showTime">{{ _formatTime(data.time) }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import * as api from '@/api/apis';
import { namespace } from 'vuex-class';
const chatModule = namespace('chat');
const appModule = namespace('app');
import { formatTime } from '@/utils/common';
import { processReturn } from '@/utils/common.ts';

@Component
export default class GenalAvatar extends Vue {
  @Prop() data: User; // 用户信息
  @Prop({ default: true }) showTime: boolean; // 是否显示时间

  @appModule.Getter('user') user: User;
  @chatModule.Getter('userGather') userGather: FriendGather;
  @chatModule.Getter('friendGather') friendGather: FriendGather;
  @chatModule.Getter('socket') socket: SocketIOClient.Socket;
  @chatModule.Mutation('set_active_room') setActiveRoom: Function;

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

  async deleteUser(userId: string) {
    let res = await api.deleteUser({
      uid: this.user.userId,
      psw: this.user.password,
      did: userId,
    });
    let data = processReturn(res);
  }

  _setActiveRoom(userId: string) {
    this.setActiveRoom(this.friendGather[userId]);
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
    font-size: 12px;
    color: rgb(255, 255, 255, 0.75);
    margin-left: 3px;
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
