<template>
  <div class="active">
    <a-icon type="eye" @click="toggleGroupUser" class="active-button" :class="{ heightLight: showGroupUser }" />
    <div class="active-content" v-if="showGroupUser">
      <div class="active-content-sum">在线人数: {{ activeNum }}</div>
      <div class="active-content-user" v-for="user in activeGroupUser[activeRoom.groupId]" :key="user.userId">
        <a-avatar :src="user.avatar"></a-avatar>
        {{ user.username }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
const chatModule = namespace('chat');

@Component
export default class GenalActive extends Vue {
  @chatModule.State('activeRoom') activeRoom: Group & Friend;
  @chatModule.Getter('activeGroupUser') activeGroupUser: ActiveGroupUser;

  showGroupUser: boolean = false;

  get activeNum() {
    return Object.keys(this.activeGroupUser[this.activeRoom.groupId]).length;
  }

  toggleGroupUser() {
    this.showGroupUser = !this.showGroupUser;
  }
}
</script>
<style lang="scss" scoped>
.active {
  position: absolute;
  width: 170px;
  color: rgb(0, 0, 0, 0.85);
  right: 0;
  z-index: 100;
  border-radius: 0 0 5px 5px;
  .active-button {
    position: absolute;
    z-index: 999;
    top: -43px;
    right: 24px;
    font-size: 25px;
    color: #fff;
    cursor: pointer;
  }
  .active-button.heightLight {
    color: skyblue;
  }
  .active-button:hover {
    color: rgb(135, 206, 235, 0.5);
  }
  .active-content {
    background-color: #fff;
    overflow-y: scroll;
    padding: 12px;
    max-height: 300px;
    border-radius: 0 0 5px 5px;
    .active-content-sum {
      font-weight: bold;
      text-align: left;
      height: 40px;
      line-height: 40px;
      border-bottom: 1px solid rgb(135, 206, 235, 0.5);
      margin: -5px 0 10px 0;
    }
    .active-content-user {
      width: 150px;
      overflow: hidden; //超出的文本隐藏
      text-overflow: ellipsis; //溢出用省略号显示
      white-space: nowrap; //溢出不换行
      text-align: left;
      height: 40px;
      line-height: 40px;
    }
  }
}
::-webkit-scrollbar {
  display: none !important;
}
</style>
