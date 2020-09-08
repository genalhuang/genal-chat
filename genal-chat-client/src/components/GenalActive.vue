<template>
  <div class="active">
    <a-icon type="team" @click="toggleGroupUser" class="active-button" :class="{ heightLight: showGroupUser }" />
    <a-drawer
      placement="right"
      :closable="false"
      :visible="showGroupUser"
      :get-container="getElement"
      @close="toggleGroupUser"
      :wrap-style="{ position: 'absolute' }"
    >
      <div class="active-content" v-if="activeGroupUser[activeRoom.groupId]">
        <div class="actiev-content-title">群聊管理</div>
        <div class="active-content-sum">在线人数: {{ activeNum }}</div>
        <div class="active-content-users">
          <div class="active-content-user" v-for="user in activeGroupUser[activeRoom.groupId]" :key="user.userId">
            <a-avatar :src="user.avatar"></a-avatar>
            {{ user.username }}
          </div>
        </div>
        <a-button type="danger" class="active-content-out">退出</a-button>
      </div>
    </a-drawer>
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

  getElement() {
    console.log('asdf', document.getElementsByClassName('message')[0]);
    return document.getElementsByClassName('message')[0];
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
}
::-webkit-scrollbar {
  display: none !important;
}
</style>
