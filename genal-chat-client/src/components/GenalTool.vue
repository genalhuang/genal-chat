<template>
  <div class="tool">
    <div class='tool-avatar'>
      <div class='tool-avatar-img'>
<!--        <img v-if='tool.avatar' :src="tool.avatar" alt="">-->
        <img  v-if='user.name' src="@/assets/avatar.jpeg" alt="">
      </div>
      <div class='tool-avatar-name'>{{user.name}}</div>
    </div>
    <div class="tool-set" >
      <a-icon class='tool-set-icon' type="login" @click="showTool"/>
      <a-icon class='tool-set-icon' type="logout" @click="clearUserInfo"/>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import {mapMutations, mapGetters} from "vuex";

@Component({
  computed: {
    ...mapGetters(['showLoginModal'])
  },
  methods: {
    ...mapMutations(['delUserInfo', 'changeShowLoginModal'])
  }
})
export default class GenalTool extends Vue {
  @Prop({ default: () => ({
    name: '',
    passwrod: '',
    avatar: ''
  })}) user: User;

  showTool() {
    // @ts-ignore
    this.changeShowLoginModal(true)
  }

  clearUserInfo() {
    //@ts-ignore
    this.delUserInfo()
    this.$router.go(0)
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
    font-size: 20px;
    position: absolute;
    bottom: 10px;
    margin: 0 5px 0 0;
    .tool-set-icon {
      transition: all 0.2s linear;
      cursor: pointer;
      margin: 10px;
      &:hover {
        color: skyblue;
      }
    }
  }
}
</style>
