<template>
  <div class="music" v-if="!mobile">
    <!--    <iframe-->
    <!--      frameborder="no"-->
    <!--      border="0"-->
    <!--      marginwidth="0"-->
    <!--      marginheight="0"-->
    <!--      width="330"-->
    <!--      height="86"-->
    <!--      src="//music.163.com/outchain/player?type=2&id=1302149826&auto=0&height=66"-->
    <!--    ></iframe>-->
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
const appModule = namespace('app');

@Component
export default class GenalMusic extends Vue {
  @appModule.Getter('mobile') mobile: boolean;
}
</script>
<style lang="scss" scoped>
.music {
  position: fixed;
  z-index: 999;
  top: 1%;
}
</style>
