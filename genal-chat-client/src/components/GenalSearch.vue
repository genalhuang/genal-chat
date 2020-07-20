<template>
  <div class="search">
    <div class='search-select'>
      <a-select
        show-search
        placeholder="搜索聊天组"
        style="width: 200px"
        :default-active-first-option="false"
        :show-arrow="false"
        :filter-option="false"
        :not-found-content="null"
        @search="handleSearch"
        @change="handleChange"
      >
        <a-select-option v-for="(chat,index) in searchData" :key="index" @click='selectChat(chat)'>
          <div v-if='chat.username'>{{chat.username}}</div>
          <div v-if='chat.groupName'>{{chat.groupName}}</div>
        </a-select-option>
      </a-select>

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

    <a-modal v-model="visibleAddGroup" cancelText='取消' okText='确定' title="创建群聊" @ok="addGroup">
      <a-input v-model='groupName' placeholder="请输入群昵称"></a-input>
    </a-modal>
    <a-modal v-model="visibleJoinGroup" cancelText='取消' okText='确定' title="加入群聊" @ok="joinGroup">
      <a-input v-model='groupId' placeholder="请输入群昵称"></a-input>
    </a-modal>
    <a-modal v-model="visibleAddFriend" cancelText='取消' okText='确定' title="添加好友" @ok="addFriend">
      <a-input v-model='friendname' placeholder="请输入好友昵称"></a-input>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class'
const chatModule = namespace('chat')

@Component
export default class GenalSearch extends Vue {
  @chatModule.State('activeRoom') activeRoom: Group & Friend;
  @chatModule.Getter('groupGather') groupGather: GroupGather;
  @chatModule.Getter('friendGather') friendGather: FriendGather;
  
  visibleAddGroup:boolean =false;
  visibleJoinGroup:boolean =false;
  visibleAddFriend:boolean =false;
  groupName: string = ''
  groupId: string = ''
  friendname: string = ''
  searchData: Array<Group | Friend> = []

  @Watch('groupGather')
  changeGroupGather() {
    this.searchData = [...Object.values(this.groupGather), ...Object.values(this.friendGather)];
  }

  @Watch('friendGather')
  changeFriendGather() {
    this.searchData = [...Object.values(this.groupGather), ...Object.values(this.friendGather)];
  }

  handleSearch(value: string) {
    this.searchData = [...Object.values(this.groupGather), ...Object.values(this.friendGather)];
    let mySearchData = []
    for(let chat of this.searchData) {
      // @ts-ignore
      if(chat.username) {
        // @ts-ignore
        if(this.isContainStr(value, chat.username)) {
          mySearchData.push(chat)
        }
      // @ts-ignore
      } else if (this.isContainStr(value, chat.groupName)) {
        mySearchData.push(chat)
      }
    }
    this.searchData = mySearchData
  }

  handleChange(value: string) {
  }
  
  isContainStr(str1:string, str2:string) {
    return str2.indexOf(str1) >= 0
  }

  selectChat(activeRoom: User & Group) {
    this.$emit('setActiveRoom', activeRoom)
  }

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

}
</script>
<style lang="scss" scoped>
.search {
  .search-select {
    display: flex;
    height: 60px;
    padding: 10px;
    align-items: center;
  }
}
</style>
