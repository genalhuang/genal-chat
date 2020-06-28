<template>
  <div class="user">
    <div class='user-avatar'>
      <div class='user-avatar-img'>
        <img v-if='user.avatar' :src="user.avatar" alt="">
        <img v-else src="@/assets/avatar.jpeg" alt="">
      </div>
      <div class='user-avatar-name'>{{user.name}}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { mapGetters } from 'vuex'

@Component
export default class User extends Vue {
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
    .user-avatar-name {
      word-break: keep-all
    }
    .user-avatar-img {
      img {
        width: 100%;
        border-radius: 3px;
      }
    }
  }
}
</style>
