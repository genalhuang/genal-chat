<template>
  <div class="emoji-content">
    <div class="emoji-content-item">
      <span @click="addEmoji('😃')">😃</span>
      <span @click="addEmoji('😁')">😁</span>
      <span @click="addEmoji('😂')">😂</span>
      <span @click="addEmoji('😄')">😄</span>
      <span @click="addEmoji('😅')">😅</span>
      <span @click="addEmoji('😆')">😆</span>
      <span @click="addEmoji('😇')">😇</span>
      <span @click="addEmoji('😈')">😈</span>
      <span @click="addEmoji('😉')">😉</span>
    </div>
    <div class="emoji-content-item">
      <span @click="addEmoji('😊')">😊</span>
      <span @click="addEmoji('😋')">😋</span>
      <span @click="addEmoji('😌')">😌</span>
      <span @click="addEmoji('😍')">😍</span>
      <span @click="addEmoji('😎')">😎</span>
      <span @click="addEmoji('😏')">😏</span>
      <span @click="addEmoji('😐')">😐</span>
      <span @click="addEmoji('😒')">😒</span>
      <span @click="addEmoji('😓')">😓</span>
    </div>
    <div class="emoji-content-item">
      <span @click="addEmoji('❓')">❓</span>
      <span @click="addEmoji('😕')">😕</span>
      <span @click="addEmoji('😖')">😖</span>
      <span @click="addEmoji('😗')">😗</span>
      <span @click="addEmoji('😘')">😘</span>
      <span @click="addEmoji('😙')">😙</span>
      <span @click="addEmoji('😚')">😚</span>
      <span @click="addEmoji('😜')">😜</span>
      <span @click="addEmoji('😝')">😝</span>
    </div>
    <div class="emoji-content-item">
      <span @click="addEmoji('😞')">😞</span>
      <span @click="addEmoji('😟')">😟</span>
      <span @click="addEmoji('😠')">😠</span>
      <span @click="addEmoji('😡')">😡</span>
      <span @click="addEmoji('😢')">😢</span>
      <span @click="addEmoji('😣')">😣</span>
      <span @click="addEmoji('😤')">😤</span>
      <span @click="addEmoji('😥')">😥</span>
      <span @click="addEmoji('😦')">😦</span>
    </div>
    <div class="emoji-content-item">
      <span @click="addEmoji('😨')">😨</span>
      <span @click="addEmoji('😩')">😩</span>
      <span @click="addEmoji('😪')">😪</span>
      <span @click="addEmoji('😫')">😫</span>
      <span @click="addEmoji('😬')">😬</span>
      <span @click="addEmoji('😭')">😭</span>
      <span @click="addEmoji('😮')">😮</span>
      <span @click="addEmoji('😯')">😯</span>
      <span @click="addEmoji('😰')">😰</span>
    </div>
    <div class="emoji-content-item">
      <span @click="addEmoji('😲')">😲</span>
      <span @click="addEmoji('😳')">😳</span>
      <span @click="addEmoji('😴')">😴</span>
      <span @click="addEmoji('😵')">😵</span>
      <span @click="addEmoji('🧐')">🧐</span>
      <span @click="addEmoji('😷')">😷</span>
      <span @click="addEmoji('🙁')">🙁</span>
      <span @click="addEmoji('🙂')">🙂</span>
      <span @click="addEmoji('🙃')">🙃</span>
    </div>
    <div class="emoji-content-item">
      <span @click="addEmoji('🤐')">🤐</span>
      <span @click="addEmoji('🤑')">🤑</span>
      <span @click="addEmoji('🤒')">🤒</span>
      <span @click="addEmoji('🤓')">🤓</span>
      <span @click="addEmoji('🤔')">🤔</span>
      <span @click="addEmoji('🤕')">🤕</span>
      <span @click="addEmoji('🤠')">🤠</span>
      <span @click="addEmoji('🤡')">🤡</span>
      <span @click="addEmoji('🤢')">🤢</span>
    </div>
    <div class="emoji-content-item">
      <span @click="addEmoji('🤤')">🤤</span>
      <span @click="addEmoji('🤥')">🤥</span>
      <span @click="addEmoji('🤧')">🤧</span>
      <span @click="addEmoji('🤨')">🤨</span>
      <span @click="addEmoji('🤩')">🤩</span>
      <span @click="addEmoji('🤪')">🤪</span>
      <span @click="addEmoji('🤫')">🤫</span>
      <span @click="addEmoji('🤬')">🤬</span>
      <span @click="addEmoji('🤭')">🤭</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

@Component
export default class GenalEmoji extends Vue {
  addEmoji(emoji: string) {
    this.$emit('addEmoji', emoji);
  }
}
</script>
<style lang="scss" scoped>
.emoji-content {
  color: #000;
  font-size: 20px;
  width: 250px;
  // 禁止文字被鼠标选中
  moz-user-select: -moz-none;
  -moz-user-select: none;
  -o-user-select: none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
  .emoji-content-item {
    display: flex;
    justify-content: space-evenly;
    flex-wrap: nowrap;
    span {
      cursor: pointer;
    }
  }
}
</style>
