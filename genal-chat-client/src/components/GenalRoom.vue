<template>
  <div class="room">
    <div style='display:flex;'>
      <a-input></a-input>
      <a-dropdown>
        <div class="ant-dropdown-link" @click="e => e.preventDefault()">
          <a-button><a-icon type="plus" /></a-button>
        </div>
        <a-menu slot="overlay">
          <a-menu-item>
            <div @click='() => visibleGroup =!visibleGroup'>创建群</div>
          </a-menu-item>
          <a-menu-item>
            <div @click='() => visibleJoinGroup =!visibleJoinGroup'>加入群聊</div>
          </a-menu-item>
          <a-menu-item>
            <div @click='() => visibleFriend =!visibleFriend'>添加好友</div>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>
    <div 
      class="room-card" 
      v-for='(group,groupId) in groupGather'
      :key='groupId'
      :class="{'active': activeRoom && activeRoom.groupId === group.groupId}"
      @click="changeActiveRoom(group)"
    >
      <div class="room-card-name">{{group.groupname}}</div>
    </div>

    <div
      class="room-card"
      v-for='(friend,userId) in friendGather'
      :key='userId'
      :class="{'active': activeRoom && activeRoom.userId === friend.userId}"
      @click="changeActiveRoom(friend)"
    >
      <div class="room-card-name">{{friend.username}}</div>
    </div>

    <!-- <div>
      <div v-for="(item,index) in rooms" :key="index">
        <div v-if='groupGather[item.groupId]'>
          <div
            class="room-card"
            :class="{'active': activeRoom.groupId === item.groupId}"
            @click="changeActiveRoom(item)"
          >
            <div class="room-card-name">{{groupGather[item.groupId].groupname}}</div>
          </div>
        </div>
        <div v-if='userGather[item.friendId]'>
          <div
            class="room-card"
            :class="{'active': activeRoom.friendId === item.friendId}"
            @click="changeActiveRoom(item)"
          >
            <div class="room-card-name">{{userGather[item.friendId].username}}</div>
          </div>
        </div>
      </div>
    </div> -->
    
    <a-modal v-model="visibleGroup" title="Basic Modal" @ok="addGroup">
      <a-input v-model='groupname' placeholder="群"></a-input>
    </a-modal>
    <a-modal v-model="visibleJoinGroup" title="Basic Modal" @ok="joinGroup">
      <a-input v-model='groupname' placeholder="加入的群名字"></a-input>
    </a-modal>
    <a-modal v-model="visibleFriend" title="Basic Modal" @ok="addFriend">
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

  @chatModule.Getter('friends') friends: Friend[];
  @chatModule.State('activeRoom') activeRoom: Group & Friend;
  @chatModule.Getter('groupGather') groupGather: GroupGather;
  @chatModule.Getter('friendGather') friendGather: FriendGather;
  
  rooms: Array<Group | Friend> = [];
  visibleGroup:boolean =false;
  visibleJoinGroup:boolean =false;
  visibleFriend:boolean =false;
  groupname: string = ''
  friendname: string = ''


  @Watch('friends') 
  changeFriends() {
    this.initRooms()
  }

  addGroup() {
    this.visibleGroup=false
    this.$emit('addGroup', this.groupname)
  }

  joinGroup() {
    this.visibleJoinGroup = false;
    this.$emit('joinGroup', this.groupname)
  }

  addFriend() {
    this.visibleFriend=false
    this.$emit('addFriend', this.friendname)
  }

  changeActiveRoom(activeRoom: User & Group) {
    this.$emit('setActiveRoom', activeRoom)
  }

  initRooms() {
    this.rooms = [...this.friends]
    this.sortRoom()
    console.log(this.rooms)
  }

  sortRoom() {
  }
}
</script>
<style lang="scss" scoped>
  .room {
    height: 100%;
    overflow: auto;
    .room-card {
      min-height: 52px;
      background-color: rgb(233, 233, 233);
      /*margin: 5px;*/
      width: 200px;
      margin-bottom: 1px;
      padding: 5px 10px;
      text-align: left;
      transition: all 0.2s linear;
      cursor: pointer;
      &:hover {
        background-color: #ccc;
      }
      &.active {
        background-color: #ccc;
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
