<template>
  <div class="room">
    <div 
      class="room-card" 
      v-for='(group,groupId) in groupGather'
      :key='groupId'
      :class="{'active': activeRoom && activeRoom.groupId === group.groupId}"
      @click="changeActiveRoom(group)"
    >
      <div class="room-card-name">{{group.groupName}}</div>
      <div class='room-card-new' v-if='group.messages'>{{group.messages[group.messages.length-1].content}}</div>
    </div>
    <div
      class="room-card"
      v-for='(friend,userId) in friendGather'
      :key='userId'
      :class="{'active': activeRoom && activeRoom.userId === friend.userId}"
      @click="changeActiveRoom(friend)"
    >
      <div class="room-card-name">{{friend.username}}</div>
      <div class='room-card-new' v-if='friend.messages'>{{friend.messages[friend.messages.length-1].content}}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class'
const chatModule = namespace('chat')

@Component
export default class GenalRoom extends Vue {
  @chatModule.State('activeRoom') activeRoom: Group & Friend;
  @chatModule.Getter('groupGather') groupGather: GroupGather;
  @chatModule.Getter('friendGather') friendGather: FriendGather;

  changeActiveRoom(activeRoom: User & Group) {
    this.$emit('setActiveRoom', activeRoom)
  }
}
</script>
<style lang="scss" scoped>
  .room {
    height: calc(100% - 60px);
    overflow: auto;
    .room-card {
      min-height: 60px;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      background-color: rgba(54, 50, 50, 0.1);
      padding: 5px 10px;
      text-align: left;
      transition: all 0.2s linear;
      cursor: pointer;
      &:hover {
        background-color: rgb(0, 0, 0,.3);
      }
      &.active {
        background-color: rgb(0, 0, 0,.3);
      }
      .room-card-name {
        overflow:hidden; //超出的文本隐藏
        text-overflow:ellipsis; //溢出用省略号显示
        white-space:nowrap; //溢出不换行
      }
      .room-card-new {
        overflow:hidden; //超出的文本隐藏
        text-overflow:ellipsis; //溢出用省略号显示
        white-space:nowrap; //溢出不换行
        color: gray;
        font-size: 14px;
      }
    }
  }
</style>
