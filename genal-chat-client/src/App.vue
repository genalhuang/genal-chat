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
  background: url('https://d-paper.i4.cn/max/2019/04/04/15/1554362711395_207730.jpg');
  // background: url(https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cc98cbc4ca284fc0aa509b12db0e325e~tplv-k3u1fbpfcp-zoom-1.image?imageView2/2/w/800/q/85);
  background-size: cover;
  background-color: #fff;
  .background {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
