<template>
  <div class="tool">
    <div class="tool-avatar">
      <div class="tool-avatar-img" @click="showModal('showUserModal')">
        <img v-if="user" :src="user.avatar" alt="" />
      </div>
      <div class="tool-avatar-name">{{ user.username }}</div>
    </div>
    <div class="tool-out">
      <a-icon class="tool-out-icon" type="poweroff" @click="logout" />
    </div>
    <a-tooltip placement="topLeft" arrow-point-at-center>
      <div slot="title">
        <div>请文明聊天</div>
        <div>截图粘贴可发送图片</div>
      </div>
      <a-icon type="bulb" class="tip" />
    </a-tooltip>
    <a href="https://github.com/genaller/genal-chat" target="_blank" class="github"><a-icon type="github"/></a>
    <a-modal title="用户信息" :visible="showUserModal" footer="" @cancel="handleCancel('showUserModal')">
      <div class="tool-user">
        <div
          @mouseover="showUpload = true"
          @mouseleave="showUpload = false"
          class="tool-user-avatar"
          :class="{ active: showUpload || uploading }"
        >
          <a-avatar :src="user.avatar" class="img" :size="100"></a-avatar>
          <a-upload v-if="showUpload && !uploading" class="tool-user-upload" :show-upload-list="false" :before-upload="beforeUpload">
            <div class="text">
              <a-icon type="upload" style="margin-right: 4px;" />
              <span>更换头像</span>
            </div>
          </a-upload>
          <a-icon class="icon" v-if="uploading" type="loading" spin />
        </div>
        <div class="tool-user-info">
          <div class="tool-user-title">更改用户名</div>
          <a-input v-model="username" placeholder="请输入用户名"></a-input>
          <a-button type="primary" @click="changeUserName">确认</a-button>
        </div>
        <div class="tool-user-info">
          <div class="tool-user-title">更改密码</div>
          <a-input v-model="password" placeholder="请输入密码"></a-input>
          <a-button type="primary" @click="changePassword">确认</a-button>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { setUserAvatar } from '@/api/apis';
import { DEFAULT_GROUP } from '@/const/index';
import { namespace } from 'vuex-class';
import * as apis from '@/api/apis';
import { processReturn, nameVerify, passwordVerify } from '@/utils/common.ts';
const appModule = namespace('app');
const chatModule = namespace('chat');

@Component
export default class GenalTool extends Vue {
  @appModule.Getter('user') user: User;
  @appModule.Mutation('set_user') setUser: Function;
  @chatModule.Getter('socket') socket: SocketIOClient.Socket;

  showUpload: boolean = false;
  showUserModal: boolean = false;
  username: string = '';
  password: string = '';
  uploading: boolean = false;
  avatar: any = '';

  @Watch('user')
  userChange() {
    this.username = this.user.username;
    this.password = this.user.password;
  }

  created() {
    this.username = this.user.username;
    this.password = this.user.password;
  }

  logout() {
    this.$emit('logout');
  }

  showModal(modalType: string) {
    this.username = this.user.username;
    this.showUserModal = true;
  }

  handleCancel(modalType: string) {
    this.showUserModal = false;
  }

  async changeUserName() {
    if (!nameVerify(this.username)) {
      return;
    }
    let user: User = JSON.parse(JSON.stringify(this.user));
    user.username = this.username;
    let res = await apis.patchUserName(user);
    let data = processReturn(res);
    if (data) {
      console.log(data);
      this.setUser(data);
      // 通知其他用户个人信息改变
      this.socket.emit('joinGroupSocket', {
        groupId: DEFAULT_GROUP,
        userId: data.userId,
      });
    }
  }

  async changePassword() {
    if (!passwordVerify(this.username)) {
      return;
    }
    let user: User = JSON.parse(JSON.stringify(this.user));
    let res = await apis.patchPassword(user, this.password);
    let data = processReturn(res);
    if (data) {
      this.setUser(data);
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
    this.handleUpload();
    return false;
  }

  async handleUpload() {
    this.uploading = true;
    const formData = new FormData();
    formData.append('avatar', this.avatar);
    formData.append('userId', this.user.userId);
    formData.append('password', this.user.password);
    let data = processReturn(await setUserAvatar(formData));
    if (data) {
      this.setUser(data);
      this.uploading = false;
      this.showUpload = false;
      // 通知其他用户个人信息改变
      this.socket.emit('joinGroupSocket', {
        groupId: DEFAULT_GROUP,
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
        object-fit: cover;
      }
    }
    .tool-avatar-name {
      overflow: hidden; //超出的文本隐藏
      text-overflow: ellipsis; //溢出用省略号显示
      white-space: nowrap; //溢出不换行
      margin-top: 2px;
    }
  }
  .tool-out {
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
    color: #fff;
    position: absolute;
    font-size: 25px;
    bottom: 60px;
    left: 25px;
    &:hover {
      color: skyblue;
    }
  }
}
.tool-user {
  text-align: center;
  font-size: 16px;
  .tool-user-avatar {
    width: 100px;
    margin: 0 auto 24px;
    position: relative;
    .tool-user-upload {
      .text {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        line-height: 100px;
        font-weight: bold;
      }
    }
    .icon {
      position: absolute;
      top: 35px;
      left: 33px;
      color: #fff;
      font-size: 35px;
      font-weight: bold;
    }
    &.active {
      .img {
        filter: blur(3px);
      }
    }
  }

  .tool-user-info {
    display: flex;
    justify-content: left;
    align-items: center;
    .ant-input {
      width: 200px;
      margin-right: 5px;
    }
    .tool-user-title {
      width: 100px;
      text-align: left;
      font-weight: bold;
      word-break: keep-all;
      margin-right: 15px;
    }
    &:nth-child(2) {
      margin-bottom: 15px;
    }
  }
}
.tool-out-icon {
  transition: all 0.2s linear;
  cursor: pointer;
  margin: 10px;
  &:hover {
    color: skyblue;
  }
}
</style>
