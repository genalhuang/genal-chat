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
  padding: 10px 10px;
  height: 98%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  .tool-avatar {
    width: 65px;
    .tool-avatar-img {
      margin: 0 auto;
      width: 55px;
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
    font-size: 25px;
    transition: all 0.2s linear;
    cursor: pointer;
    &:hover {
      color: skyblue;
    }
    .tool-set-icon {

    }
  }
}
</style>
