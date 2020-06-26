<template>
  <div class="header">
    聊天窗頭部
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class GenalHeader extends Vue {}
</script>
<style lang="scss" scoped>
.header {
  height: 100px;
  background-color: cyan;
}
</style>
