<template>
  <div class="chat-tool" v-if='activeRoom'>
    <div v-if='groupGather[activeRoom.groupId]'> 
      {{groupGather[activeRoom.groupId].groupName}}
    </div>
    <div v-else>
      {{userGather[activeRoom.userId].username}}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import GenalAvatar from './GenalAvatar.vue'
import * as api from '@/api/apis';
import { namespace } from 'vuex-class'
const chatModule = namespace('chat')
const appModule = namespace('app')

@Component({
  components: {
    GenalAvatar
  }
})
export default class GenalChatTool extends Vue {
  @chatModule.Getter('activeRoom') activeRoom: Group & Friend;
  @chatModule.Getter('groupGather') groupGather: GroupGather;
  @chatModule.Getter('userGather') userGather: FriendGather;
}
</script>
<style lang="scss" scoped>
.chat-tool {
  height: 60px;
  line-height: 60px;
  background-color: rgb(0, 0, 0,.3);
}
</style>
