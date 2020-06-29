<template>
  <div class="user">
    <div class='user-avatar'>
      <div class='user-avatar-img'>
<!--        <img v-if='user.avatar' :src="user.avatar" alt="">-->
        <img src="@/assets/avatar.jpeg" alt="">
      </div>
      <div class='user-avatar-name'>{{user.name}}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { mapGetters } from 'vuex'

@Component
export default class GenalTool extends Vue {
  @Prop({ default: () => ({
    name: '',
    passwrod: '',
    avatar: ''
  })}) user: User;
}
</script>
<style lang="scss" scoped>
.user {
  color: #fff;
  padding: 10px 10px;
  .user-avatar {
    .user-avatar-img {
      img {
        width: 100%;
        border-radius: 3px;
      }
    }
    .user-avatar-name {
      overflow:hidden; //超出的文本隐藏
      text-overflow:ellipsis; //溢出用省略号显示
      white-space:nowrap; //溢出不换行
      margin-top: 2px;
    }
  }
}
</style>
