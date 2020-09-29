<template>
  <div id="app">
    <router-view />
    <img class="background" v-if="background" :src="background" alt="" />
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { DEFAULT_BACKGROUND } from '@/const';
const appModule = namespace('app');

@Component
export default class GenalChat extends Vue {
  @appModule.Getter('user') user: User;
  @appModule.Getter('background') background: string;
  @appModule.Mutation('set_mobile') setMobile: Function;
  @appModule.Mutation('set_background') set_background: Function;

  mounted() {
    this.setMobile(this.isMobile());
    if (!this.background || !this.background.trim().length) {
      this.set_background(DEFAULT_BACKGROUND);
    }
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
  height: 100%;
  width: 100%;
  overflow: hidden;
  background-size: cover;
  color: rgba(255, 255, 255, 0.85);
  background-color: #fff;
  .background {
    position: absolute;
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
}
</style>
