<template>
  <div id="app">
    <router-view />
    <img class="background" v-if="background" :src="background" alt="" />
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
const appModule = namespace('app');

@Component
export default class GenalChat extends Vue {
  @appModule.Getter('user') user: User;
  @appModule.Getter('background') background: string;
  @appModule.Mutation('set_mobile') setMobile: Function;

  mounted() {
    this.setMobile(this.isMobile());
  }

  isMobile() {
    let flag = navigator.userAgent.match(
      /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
    );
    return flag && flag.length;
  }
}
</script>
<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: #2c3e50;
  height: 100%;
  width: 100%;
  overflow: hidden;
  // background: url(~@/assets/bg3.jpg);
  background: url(~@/assets/bg3.jpg);
  background-size: cover;
  background-color: #fff;
  .background {
    position: absolute;
    width: 100%;
    height: 100%;
  }
}
</style>
