<template>
  <div class="tool">
    <div class='tool-avatar'>
      <div class='tool-avatar-img' @click='showModal("showUserModal")'>
        <img v-if='user' :src="user.avatar" alt="">
        <img v-else src="@/assets/avatar.jpeg" alt="">
      </div>
      <div class='tool-avatar-name'>{{user.username}}</div>
    </div>
    <div class="tool-set">
      <a-icon class='tool-set-icon' type="setting" @click='showModal("showSetModal")'/>
    </div>

    <a-modal
      title="用户信息"
      :visible="showUserModal"
      footer=""
      @cancel='handleCancel("showUserModal")'
    >
      <div class='tool-user'>
        <a-avatar :src='user.avatar' :size='100'></a-avatar>
        <div class='tool-user-name'>
          <div class='tool-user-name-title'>更改用户名</div>
          <a-input size='large' v-model='username' placeholder="请输入用户名"></a-input>
          <a-button @click='changeUser'>确认</a-button>
        </div>
      </div>
    </a-modal>

    <a-modal
      title="设置"
      :visible="showSetModal"
      footer=""
      @cancel='handleCancel("showSetModal")'
    >
      <div>退出 <a-icon class='tool-set-icon' type="poweroff" @click="logout"/></div>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import {mapMutations, mapGetters} from "vuex";
import { namespace } from 'vuex-class'
import * as apis  from '@/api/apis'
import { processReturn } from '@/utils/common.ts';
const appModule = namespace('app')

@Component
export default class GenalTool extends Vue {
  @appModule.Getter('user') user: User;
  showSetModal: boolean = false;
  showUserModal: boolean = false;
  username: string = ''

  created() {
    this.username = this.user.username
  }

  logout() {
    this.$emit('logout')
  }

  showModal(modalType: 'showSetModal' | 'showUserModal') {
    this[modalType] = true;
  }

  handleCancel(modalType: 'showSetModal' | 'showUserModal') {
    this[modalType] = false;
  }

  async changeUser() {
    let user: User = JSON.parse(JSON.stringify(this.user))
    user.username = this.username
    let res = await apis.patchUser(user)
    processReturn(res)
    this.logout()
  }
}
</script>
<style lang="scss" scoped>
.tool {
  color: #fff;
  padding: 10px 5px;
  height: 98%;
  position: relative;
  .tool-avatar {
    .tool-avatar-img {
      margin: 0 auto;
      img {
        cursor: pointer;
        width: 90%;
        border-radius: 3px;
      }
    }
    .tool-avatar-name {
      overflow:hidden; //超出的文本隐藏
      text-overflow:ellipsis; //溢出用省略号显示
      white-space:nowrap; //溢出不换行
      margin-top: 2px;
    }
  }
  .tool-set {
    display: flex;
    flex-direction: column;
    font-size: 20px;
    position: absolute;
    bottom: 10px;
    left: 12px;
  }
}
.tool-user {
  text-align: center;
  .tool-user-name {
    display: flex;
    align-items: center;
    > * {
      margin-right: 5px;
    }
    .tool-user-name-title {
      font-weight: bold;
      font-size: 15px;
      margin-right: 15px;
    }
  }
}
.tool-set-icon {
  transition: all 0.2s linear;
  cursor: pointer;
  margin: 10px;
  &:hover {
    color: skyblue;
  }
}
</style>
