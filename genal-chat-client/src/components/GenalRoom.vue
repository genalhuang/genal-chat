<template>
  <div class="room">
    <a-button @click='() => visibleGroup =!visibleGroup'>创建一个群</a-button>
    <a-modal v-model="visibleGroup" title="Basic Modal" @ok="addGroup">
      <a-input v-model='groupname' placeholder="群"></a-input>
    </a-modal>
    <a-button @click='() => visibleFriend =!visibleFriend'>添加好友</a-button>
    <a-modal v-model="visibleFriend" title="Basic Modal" @ok="addFriend">
      <a-input v-model='friendname' placeholder="好友"></a-input>
    </a-modal>

    <div v-for="(item,index) in rooms" :key="index">
      <div v-if='item.groupId'>
        <div
          class="room-card"
          :class="{'active': activeRoom.groupId === item.groupId}"
          @click="changeActiveRoom(item)"
        >
          <div class="room-card-name">{{item.groupId}}</div>
        </div>
      </div>
      <div v-if='item.friendId'>
        <div
          class="room-card"
          :class="{'active': activeRoom.friendId === item.friendId}"
          @click="changeActiveRoom(item)"
        >
          <div class="room-card-name">{{item.friendId}}</div>
        </div>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class'
const chatModule = namespace('chat')

@Component
export default class GenalRoom extends Vue {

  @chatModule.Getter('groups') groups: GroupDto[];
  @chatModule.Getter('friends') friends: FriendDto[];
  @chatModule.State('activeRoom') activeRoom: GroupDto & FriendDto;

  rooms: Array<GroupDto | FriendDto> = [];
  visibleGroup:boolean =false;
  visibleFriend:boolean =false;
  groupname: string = ''
  friendname: string = ''

  @Watch('groups') 
  changeGroups() {
    this.initRooms()
  }

  @Watch('friends') 
  changeFriends() {
    this.initRooms()
  }

  addGroup() {
    this.visibleGroup=false
    this.$emit('addGroup', this.groupname)
  }

  addFriend() {
    this.visibleFriend=false
    this.$emit('addFriend', 'e9b6dca2-3614-4a3b-80a3-4d61dc1d64a5')
  }

  changeActiveRoom(activeRoom: FriendDto & GroupDto) {
    this.$emit('setActiveRoom', activeRoom)
  }

  initRooms() {
    this.rooms = [...this.groups,...this.friends]
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
