<template>
  <a-popover title="Emoji">
    <template slot="content">
      <div style='color:#000;font-size:20px;'>
        <div>
          <span @click='addEmoji("😃")'>😃</span>
          <span @click='addEmoji("😁")'>😁</span>
          <span @click='addEmoji("😂")'>😂</span>
          <span @click='addEmoji("😄")'>😄</span>
          <span @click='addEmoji("😅")'>😅</span>
          <span @click='addEmoji("😆")'>😆</span>
          <span @click='addEmoji("😇")'>😇</span>
          <span @click='addEmoji("😈")'>😈</span>
          <span @click='addEmoji("😉")'>😉</span>
        </div>
        <div>
          <span @click='addEmoji("😊")'>😊</span>
          <span @click='addEmoji("😋")'>😋</span>
          <span @click='addEmoji("😌")'>😌</span>
          <span @click='addEmoji("😍")'>😍</span>
          <span @click='addEmoji("😎")'>😎</span>
          <span @click='addEmoji("😏")'>😏</span>
          <span @click='addEmoji("😐")'>😐</span>
          <span @click='addEmoji("😒")'>😒</span>
          <span @click='addEmoji("😓")'>😓</span>
        </div>
        <div>
          <span @click='addEmoji("😔")'>😔</span>
          <span @click='addEmoji("😕")'>😕</span>
          <span @click='addEmoji("😖")'>😖</span>
          <span @click='addEmoji("😗")'>😗</span>
          <span @click='addEmoji("😘")'>😘</span>
          <span @click='addEmoji("😙")'>😙</span>
          <span @click='addEmoji("😚")'>😚</span>
          <span @click='addEmoji("😜")'>😜</span>
          <span @click='addEmoji("😝")'>😝</span>
        </div>
        <div>
          <span @click='addEmoji("😔")'>😔</span>
          <span @click='addEmoji("😕")'>😕</span>
          <span @click='addEmoji("😖")'>😖</span>
          <span @click='addEmoji("😗")'>😗</span>
          <span @click='addEmoji("😘")'>😘</span>
          <span @click='addEmoji("😙")'>😙</span>
          <span @click='addEmoji("😚")'>😚</span>
          <span @click='addEmoji("😜")'>😜</span>
          <span @click='addEmoji("😛")'>😛</span>
        </div>
        <div>
          <span @click='addEmoji("😞")'>😞</span>
          <span @click='addEmoji("😟")'>😟</span>
          <span @click='addEmoji("😠")'>😠</span>
          <span @click='addEmoji("😡")'>😡</span>
          <span @click='addEmoji("😢")'>😢</span>
          <span @click='addEmoji("😣")'>😣</span>
          <span @click='addEmoji("😤")'>😤</span>
          <span @click='addEmoji("😥")'>😥</span>
          <span @click='addEmoji("😦")'>😦</span>
        </div>
        <div>
          <span @click='addEmoji("😨")'>😨</span>
          <span @click='addEmoji("😩")'>😩</span>
          <span @click='addEmoji("😪")'>😪</span>
          <span @click='addEmoji("😫")'>😫</span>
          <span @click='addEmoji("😬")'>😬</span>
          <span @click='addEmoji("😭")'>😭</span>
          <span @click='addEmoji("😮")'>😮</span>
          <span @click='addEmoji("😯")'>😯</span>
          <span @click='addEmoji("😰")'>😰</span>
        </div>
        <div>
          <span @click='addEmoji("😲")'>😲</span>
          <span @click='addEmoji("😳")'>😳</span>
          <span @click='addEmoji("😴")'>😴</span>
          <span @click='addEmoji("😵")'>😵</span>
          <span @click='addEmoji("🧐")'>🧐</span>
          <span @click='addEmoji("😷")'>😷</span>
          <span @click='addEmoji("🙁")'>🙁</span>
          <span @click='addEmoji("🙂")'>🙂</span>
          <span @click='addEmoji("🙃")'>🙃</span>
        </div>
        <div>
          <span @click='addEmoji("🤐")'>🤐</span>
          <span @click='addEmoji("🤑")'>🤑</span>
          <span @click='addEmoji("🤒")'>🤒</span>
          <span @click='addEmoji("🤓")'>🤓</span>
          <span @click='addEmoji("🤔")'>🤔</span>
          <span @click='addEmoji("🤕")'>🤕</span>
          <span @click='addEmoji("🤠")'>🤠</span>
          <span @click='addEmoji("🤡")'>🤡</span>
          <span @click='addEmoji("🤢")'>🤢</span>
        </div>
        <div>
          <span @click='addEmoji("🤤")'>🤤</span>
          <span @click='addEmoji("🤥")'>🤥</span>
          <span @click='addEmoji("🤧")'>🤧</span>
          <span @click='addEmoji("🤨")'>🤨</span>
          <span @click='addEmoji("🤩")'>🤩</span>
          <span @click='addEmoji("🤪")'>🤪</span>
          <span @click='addEmoji("🤫")'>🤫</span>
          <span @click='addEmoji("🤬")'>🤬</span>
          <span @click='addEmoji("🤭")'>🤭</span>
        </div>
      </div>

    </template>
    <a-button trigger="click" class='genal-emoji'>
      😃
    </a-button>
  </a-popover>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';


@Component
export default class GenalMessage extends Vue {
  addEmoji(emoji: string) {
    this.$emit('addEmoji', emoji)
  }
}
</script>
<style lang="scss" scoped>
.genal-emoji {
  height: 40px;
}
</style>
