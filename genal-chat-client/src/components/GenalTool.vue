<template>
  <div class="tool">
    <div class="tool-avatar">
      <div class="tool-avatar-img" @click="showModal('showUserModal')">
        <img v-if="user" :src="user.avatar" alt="" />
      </div>
      <div class="tool-avatar-name">{{ user.username }}</div>
    </div>
    <div class="tool-set">
      <a-icon class="tool-set-icon" type="setting" @click="showModal('showSetModal')" />
    </div>
    <a-tooltip placement="topLeft" arrow-point-at-center>
      <div slot="title">
        <div>pc端体验最佳</div>
        <div>截图粘贴可发送图片</div>
      </div>
      <a-icon type="bulb" class="tip" />
    </a-tooltip>
    <a href="https://github.com/genaller" target="_blank" class="github"><a-icon type="github"/></a>
    <a-modal title="用户信息" :visible="showUserModal" footer="" @cancel="handleCancel('showUserModal')">
      <div class="tool-user">
        <a-avatar :src="user.avatar" class="tool-user-img" :size="100"></a-avatar>
        <div class="tool-user-avatar">
          <div class="tool-user-avatar-title">更改头像</div>
          <a-upload style="margin-left: 17px;" :show-upload-list="false" :before-upload="beforeUpload">
            <div class="upload">
              <a-icon type="upload" style="margin-right: 4px;" />
              {{ avatar.name ? avatar.name : '请选择' }}
            </div>
          </a-upload>
          <a-button class="button" type="primary" :disabled="!avatar" :loading="uploading" @click="handleUpload">
            {{ uploading ? '更换中' : '确定' }}
          </a-button>
        </div>

        <div class="tool-user-name">
          <div class="tool-user-name-title">更改用户名</div>
          <a-input v-model="username" placeholder="请输入用户名"></a-input>
          <a-button type="primary" @click="changeUser">确认</a-button>
        </div>
      </div>
    </a-modal>

    <a-modal title="设置" :visible="showSetModal" footer="" @cancel="handleCancel('showSetModal')">
      <div>退出 <a-icon class="tool-set-icon" type="poweroff" @click="logout" /></div>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { setUserAvatar } from '@/api/apis';
import { namespace } from 'vuex-class';
import * as apis from '@/api/apis';
import { processReturn, usernameVerify } from '@/utils/common.ts';
const appModule = namespace('app');
const chatModule = namespace('chat');

@Component
export default class GenalTool extends Vue {
  @appModule.Getter('user') user: User;
  @appModule.Mutation('set_user') setUser: Function;
  @chatModule.Getter('socket') socket: any;

  showSetModal: boolean = false;
  showUserModal: boolean = false;
  username: string = '';
  uploading: boolean = false;
  avatar: any = '';

  @Watch('user')
  userChange() {
    this.username = this.user.username;
  }

  created() {
    this.username = this.user.username;
  }

  logout() {
    this.$emit('logout');
  }

  showModal(modalType: 'showSetModal' | 'showUserModal') {
    this.username = this.user.username;
    this[modalType] = true;
  }

  handleCancel(modalType: 'showSetModal' | 'showUserModal') {
    this[modalType] = false;
  }

  async changeUser() {
    if (!usernameVerify(this.username)) {
      return;
    }
    let user: User = JSON.parse(JSON.stringify(this.user));
    user.username = this.username;
    let res = await apis.patchUser(user);
    let data = processReturn(res);
    if (data) {
      console.log(data);
      this.setUser(data);
      // 通知其他用户个人信息改变
      this.socket.emit('joinGroupSocket', {
        groupId: 'public',
        userId: data.userId,
      });
    } else {
      this.username = '';
    }
  }

  beforeUpload(file: any) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/gif';
    if (!isJpgOrPng) {
      return this.$message.error('请上传jpeg/jpg/png/gif格式的图片!');
    }
    const isLt1M = file.size / 1024 / 1024 < 0.5;
    if (!isLt1M) {
      return this.$message.error('图片必须小于500K!');
    }
    this.avatar = file;
    return false;
  }
  async handleUpload() {
    this.uploading = true;
    const formData = new FormData();
    formData.append('avatar', this.avatar);
    formData.append('userId', this.user.userId);

    let data = processReturn(await setUserAvatar(formData));
    if (data) {
      this.setUser(data);
      this.uploading = false;
      // 通知其他用户个人信息改变
      this.socket.emit('joinGroupSocket', {
        groupId: 'public',
        userId: data.userId,
      });
    }
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
      width: 55px;
      height: 55px;
      border-radius: 50%;
      overflow: hidden;
      cursor: pointer;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .tool-avatar-name {
      overflow: hidden; //超出的文本隐藏
      text-overflow: ellipsis; //溢出用省略号显示
      white-space: nowrap; //溢出不换行
      margin-top: 2px;
    }
  }
  .tool-set {
    display: flex;
    flex-direction: column;
    font-size: 25px;
    position: absolute;
    bottom: 0px;
    left: 13px;
  }
  .tip {
    position: absolute;
    font-size: 25px;
    bottom: 125px;
    left: 25px;
    :hover {
      color: skyblue;
    }
  }
  .github {
    position: absolute;
    font-size: 25px;
    bottom: 60px;
    left: 25px;
  }
}
.tool-user {
  text-align: center;
  font-size: 16px;
  .tool-user-img {
    margin-bottom: 24px;
  }
  .tool-user-avatar {
    display: flex;
    margin-bottom: 15px;
    .upload {
      display: flex;
      flex-wrap: nowrap;
      cursor: pointer;
      align-items: center;
      border: 1px solid #d9d9d9;
      height: 33px;
      padding: 0 5px;
      max-width: 300px;
      overflow: hidden;
      text-overflow: ellipsis;
      border-radius: 5px;
      transition: 0.1s all linear;
      &:hover {
        border: 1px solid skyblue;
        color: skyblue;
      }
    }
    .tool-user-avatar-title {
      font-weight: bold;
      word-break: keep-all;
      margin-right: 15px;
    }
    .button {
      margin-left: 5px;
    }
  }
  .tool-user-name {
    display: flex;
    align-items: center;
    > * {
      margin-right: 5px;
    }
    .tool-user-name-title {
      font-weight: bold;
      word-break: keep-all;
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
