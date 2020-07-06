<template>
  <div class="chat-tool" v-if='activeRoom'>
    <div v-if='groupGather[activeRoom.groupId] && activeRoom.groupId'> 
      {{groupGather[activeRoom.groupId].groupname}}
    </div>
    <div v-if='userGather[activeRoom.friendId] && activeRoom.friendId'>
      {{userGather[activeRoom.friendId].username}}
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
  @chatModule.Getter('activeRoom') activeRoom: GroupDto & FriendDto;
  @chatModule.Getter('groupGather') groupGather: UserGather;
  @chatModule.Getter('userGather') userGather: UserGather;

}
</script>
<style lang="scss" scoped>
.chat-tool {
  height: 50px;
  line-height: 50px;
  background-color: #e9e9e9;
}
</style>
