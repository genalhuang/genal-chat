<template>
  <div class="chat">
    <genal-login @login="addUser" :showLoginModal="showLoginModal"></genal-login>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import GenalLogin from '@/components/GenalLogin.vue'
import { mapMutations, mapGetters } from 'vuex'
import io from 'socket.io-client'

@Component({
  components: {
    GenalLogin
  },
})
export default class GenalChat extends Vue {
  showLoginModal = true;
  addUser() {
    
  }
}
</script>
<style lang="scss" scoped>
.chat {
  max-width: 800px;
  width: 800px;
  height: 600px;
  position: relative;
  background-color: #fff;
  margin: auto 20px;
  box-shadow: 6px 10px 10px #999;
  display: flex;
  border-radius: 5px;
  .chat-header {
    position: absolute;
    display: flex;
    right: 0;
    top: -50px;
  }
  .chat-part1 {
    width: 65px;
    background-color: #151515;
  }
  .chat-part2 {
    width: 200px;
    background-color: #fff;
  }
  .chat-part3 {
    flex: 1;
    background-color: #fff;
    .chat-group {
      height: 53px;
      border-bottom: 1px solid #ccc;
      line-height: 50px;
      font-weight: bold;
    }
  }
}
</style>
