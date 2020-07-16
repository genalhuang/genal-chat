<template>
  <div class="room">
    <div class='room-search'>
      <a-input></a-input>
      <a-dropdown>
        <div class="ant-dropdown-link" @click="e => e.preventDefault()">
          <a-button><a-icon type="plus" /></a-button>
        </div>
        <a-menu slot="overlay">
          <a-menu-item>
            <div @click='() => visibleAddGroup =!visibleAddGroup'>创建群</div>
          </a-menu-item>
          <a-menu-item>
            <div @click='() => visibleJoinGroup =!visibleJoinGroup'>加入群聊</div>
          </a-menu-item>
          <a-menu-item>
            <div @click='() => visibleAddFriend =!visibleAddFriend'>添加好友</div>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>
    <div>
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
    
    <a-modal v-model="visibleAddGroup" title="Basic Modal" @ok="addGroup">
      <a-input v-model='groupName' placeholder="群"></a-input>
    </a-modal>
    <a-modal v-model="visibleJoinGroup" title="Basic Modal" @ok="joinGroup">
      <a-input v-model='groupId' placeholder="加入的群名字"></a-input>
    </a-modal>
    <a-modal v-model="visibleAddFriend" title="Basic Modal" @ok="addFriend">
      <a-input v-model='friendname' placeholder="好友"></a-input>
    </a-modal>
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
  
  visibleAddGroup:boolean =false;
  visibleJoinGroup:boolean =false;
  visibleAddFriend:boolean =false;
  groupName: string = ''
  groupId: string = ''
  friendname: string = ''

  addGroup() {
    this.visibleAddGroup=false
    this.$emit('addGroup', this.groupName)
  }

  joinGroup() {
    this.visibleJoinGroup = false;
    this.$emit('joinGroup', this.groupId)
  }

  addFriend() {
    this.visibleAddFriend=false
    this.$emit('addFriend', this.friendname)
  }

  changeActiveRoom(activeRoom: User & Group) {
    this.$emit('setActiveRoom', activeRoom)
  }
}
</script>
<style lang="scss" scoped>
  .room {
    height: 100%;
    overflow: auto;
    .room-search {
      display: flex;
      height: 50px;
      background-color: rgb(221, 221, 221,.5);
      padding: 10px;
      align-items: center;
    }
    .room-card {
      min-height: 52px;
      background-color: rgb(233, 233, 233,.5);
      /*margin: 5px;*/
      width: 200px;
      margin-bottom: 1px;
      padding: 5px 10px;
      text-align: left;
      transition: all 0.2s linear;
      cursor: pointer;
      &:hover {
        background-color: rgb(204, 204, 204, .5);
      }
      &.active {
        background-color: rgb(204, 204, 204,.5);
      }
      .room-card-name {
        overflow:hidden; //超出的文本隐藏
        text-overflow:ellipsis; //溢出用省略号显示
        white-space:nowrap; //溢出不换行
        font-weight: bold;
      }
      .room-card-new {
        overflow:hidden; //超出的文本隐藏
        text-overflow:ellipsis; //溢出用省略号显示
        white-space:nowrap; //溢出不换行
        color: #878987;
        .name {
        }
        .text {
          margin-left: 5px;
        }
      }
    }
  }
</style>
