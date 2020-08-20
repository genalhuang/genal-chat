<template>
  <div class="search">
    <div class="search-select">
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
        <a-select-option v-for="(chat, index) in searchData" :key="index" @click="selectChat(chat)">
          <div v-if="chat.username">{{ chat.username }}</div>
          <div v-if="chat.groupName">{{ chat.groupName }}</div>
        </a-select-option>
      </a-select>

      <a-dropdown>
        <div class="ant-dropdown-link" @click="(e) => e.preventDefault()">
          <a-button><a-icon type="plus"/></a-button>
        </div>
        <a-menu slot="overlay">
          <a-menu-item>
            <div @click="() => (visibleAddGroup = !visibleAddGroup)">创建群</div>
          </a-menu-item>
          <a-menu-item>
            <div @click="() => (visibleJoinGroup = !visibleJoinGroup)">加入群聊</div>
          </a-menu-item>
          <a-menu-item>
            <div @click="() => (visibleAddFriend = !visibleAddFriend)">添加好友</div>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>

    <a-modal v-model="visibleAddGroup" cancelText="取消" okText="确定" title="创建群聊" @ok="addGroup">
      <a-input v-model="groupName" placeholder="请输入群昵称"></a-input>
    </a-modal>
    <a-modal v-model="visibleJoinGroup" footer="" title="加入群聊">
      <div style="display:flex">
        <a-select
          show-search
          placeholder="搜索群组"
          style="width: 90%"
          :default-active-first-option="false"
          :show-arrow="false"
          :filter-option="false"
          :not-found-content="null"
          @search="handleGroupSearch"
          @change="handleGroupChange"
        >
          <a-select-option v-for="(group, index) in groupArr" :key="index" @click="handleGroupSelect(group)">
            <div>{{ group.groupName }}</div>
          </a-select-option>
        </a-select>
        <a-button @click="joinGroup" type="primary">确定</a-button>
      </div>
    </a-modal>
    <a-modal v-model="visibleAddFriend" footer="" title="添加好友">
      <div style="display:flex">
        <a-select
          show-search
          placeholder="搜索用户"
          style="width: 90%"
          :default-active-first-option="false"
          :show-arrow="false"
          :filter-option="false"
          :not-found-content="null"
          @search="handleUserSearch"
          @change="handleUserChange"
        >
          <a-select-option v-for="(user, index) in userArr" :key="index" @click="handleUserSelect(user)">
            <div>{{ user.username }}</div>
          </a-select-option>
        </a-select>
        <a-button @click="addFriend" type="primary">确定</a-button>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { isContainStr, processReturn } from '@/utils/common.ts';
import * as apis from '@/api/apis';
import { nameVerify } from '@/utils/common';
const chatModule = namespace('chat');

@Component
export default class GenalSearch extends Vue {
  @chatModule.State('activeRoom') activeRoom: Group & Friend;
  @chatModule.Getter('groupGather') groupGather: GroupGather;
  @chatModule.Getter('friendGather') friendGather: FriendGather;

  visibleAddGroup: boolean = false;
  visibleJoinGroup: boolean = false;
  visibleAddFriend: boolean = false;
  groupName: string = '';
  searchData: Array<Group | Friend> = [];
  groupId: string = '';
  groupArr: Array<Group> = [];
  friendId: string = '';
  userArr: Array<User> = [];

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
    let mySearchData = [];
    for (let chat of this.searchData) {
      // @ts-ignore
      if (chat.username) {
        // @ts-ignore
        if (isContainStr(value, chat.username)) {
          mySearchData.push(chat);
        }
        // @ts-ignore
      } else if (isContainStr(value, chat.groupName)) {
        mySearchData.push(chat);
      }
    }
    this.searchData = mySearchData;
  }

  handleChange(value: string) {}

  async handleGroupSearch(value: string) {
    if (!value) {
      return;
    }
    let res = await apis.getGroupsByName(value);
    let data = processReturn(res);
    this.groupArr = data;
  }

  handleGroupSelect(group: Group) {
    this.groupId = group.groupId;
  }

  handleGroupChange() {
    this.groupArr = [];
  }

  async handleUserSearch(value: string) {
    if (!value) {
      return;
    }
    let res = await apis.getUsersByName(value);
    let data = processReturn(res);
    this.userArr = data;
  }

  handleUserSelect(friend: Friend) {
    this.friendId = friend.userId;
  }

  handleUserChange() {
    this.userArr = [];
  }

  selectChat(activeRoom: User & Group) {
    this.$emit('setActiveRoom', activeRoom);
  }

  addGroup() {
    this.visibleAddGroup = false;
    if (!nameVerify(this.groupName)) {
      this.visibleAddGroup = true;
      return;
    }
    this.$emit('addGroup', this.groupName);
    this.groupName = '';
  }

  joinGroup() {
    this.visibleJoinGroup = false;
    this.$emit('joinGroup', this.groupId);
    this.groupId = '';
  }

  addFriend() {
    this.visibleAddFriend = false;
    this.$emit('addFriend', this.friendId);
    this.friendId = '';
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
