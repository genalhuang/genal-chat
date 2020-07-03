<template>
  <div class="group">
    {{friends}}
    <a-button @click='() => visibleGroup =!visibleGroup'>创建一个群</a-button>
    <a-modal v-model="visibleGroup" title="Basic Modal" @ok="addGroup">
      <a-input v-model='groupname' placeholder="群"></a-input>
    </a-modal>
    <a-button @click='() => visibleFriend =!visibleFriend'>添加好友</a-button>
    <a-modal v-model="visibleFriend" title="Basic Modal" @ok="addFriend">
      <a-input v-model='friendname' placeholder="好友"></a-input>
    </a-modal>

    <div v-for="(item,index) in groups" :key="index">
      <div
        class="group-card"
        :class="{'active': activeChat.groupId === item.groupId}"
        @click="changeActiveChat(item)"
      >
        <div class="group-card-name">{{item.groupname}}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class'
const chatModule = namespace('chat')

@Component
export default class GenalGroup extends Vue {
  @chatModule.Getter('groups') groups: any;
  @chatModule.Getter('friends') friends: any;
  @chatModule.State('activeChat') activeChat: GroupDto | FriendDto;
  visibleGroup:boolean =false;
  visibleFriend:boolean =false;
  groupname: string = ''
  friendname: string = ''

  addGroup() {
    this.visibleGroup=false
    this.$emit('addGroup', this.groupname)
  }

  addFriend() {
    this.visibleFriend=false
    this.$emit('addFriend', '8cd1e680-5587-4b7e-90fe-a2eef9b9f334')
  }

  changeActiveChat(activeChat: FriendDto | GroupDto) {
    this.$emit('setActiveChat', activeChat)
  }
}
</script>
<style lang="scss" scoped>
  .group {
    height: 100%;
    overflow: auto;
    .group-card {
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
      .group-card-name {
        overflow:hidden; //超出的文本隐藏
        text-overflow:ellipsis; //溢出用省略号显示
        white-space:nowrap; //溢出不换行
        font-weight: bold;
      }
      .group-card-new {
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
