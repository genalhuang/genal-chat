import { 
  SET_SOCKET,
  ADD_GROUP,
  SET_GROUPS,
  ADD_GROUP_MESSAGE,
  SET_GROUP_MESSAGES,
  ADD_FRIEND, 
  SET_FRIENDS,
  ADD_FRIEND_MESSAGE,
  SET_FRIEND_MESSAGES
} from './mutation-types'
import { ChatState } from './state';
import { MutationTree } from 'vuex';

const mutations: MutationTree<ChatState> = {
  // 保存socket
  [SET_SOCKET](state, payload: any){
    state.socket = payload;
  },

  // 新增一个群
  [ADD_GROUP](state, payload: GroupDto) {
    state.groups.push(payload)
  },

  // 设置群
  [SET_GROUPS](state, payload: GroupDto[]) {
    state.groups = payload
  },

  // 新增一条群消息
  [ADD_GROUP_MESSAGE](state, payload: GroupMessageDto) {
    for(let i=0;i<state.groups.length; i++) {
      if(payload.groupId === state.groups[i].groupId) {
        state.groups[i].message?.push(payload)
      }
    }
  },

  // 设置群消息
  [SET_GROUP_MESSAGES](state, payload: GroupMessageDto[]) {
    for(let i=0;i<state.groups.length; i++) {
      if(payload[0].groupId === state.groups[i].groupId) {
        state.groups[i].message = payload
      }
    }
  },

  // 新增一个朋友
  [ADD_FRIEND](state, payload: FriendDto) {
    state.friends.push(payload)
  },

  // 设置朋友
  [SET_FRIENDS](state, payload: FriendDto[]) {
    state.friends = payload
  },
  [ADD_FRIEND_MESSAGE](state, payload: FriendMessageDto) {
    for(let i=0;i<state.friends.length; i++) {
      if(payload.to === state.friends[i].friendId) {
        state.friends[i].message?.push(payload)
      }
    }
  },

  // 设置私聊记录
  [SET_FRIEND_MESSAGES](state, payload: FriendMessageDto[]) {
    for(let i=0;i<state.friends.length; i++) {
      if(payload[0].to === state.friends[i].friendId) {
        state.friends[i].message = payload
      }
    }
  },

}

export default mutations;