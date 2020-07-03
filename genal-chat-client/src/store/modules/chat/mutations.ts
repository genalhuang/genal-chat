import Vue from 'vue';
import { 
  SET_SOCKET,
  ADD_GROUP,
  SET_GROUPS,
  ADD_GROUP_MESSAGE,
  SET_GROUP_MESSAGES,
  ADD_FRIEND, 
  SET_FRIENDS,
  ADD_FRIEND_MESSAGE,
  SET_FRIEND_MESSAGES,
  SET_ACTIVE_ROOM
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
        if(state.groups[i].messages) {
          state.groups[i].messages.push(payload)
        } else {
          state.groups[i].messages = [payload]
        }
      }
    }
  },

  // 设置群消息
  [SET_GROUP_MESSAGES](state, payload: GroupMessageDto[]) {
    if(payload.length) {
      for(let i=0;i<state.groups.length; i++) {
        if(payload[0].groupId === state.groups[i].groupId) {
          // vuex对象数组中对象改变不更新问题
          Vue.set(state.groups[i], 'messages' , payload)
        }
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

  // 新增一条私聊消息
  [ADD_FRIEND_MESSAGE](state, payload: FriendMessageDto) {
    for(let i=0;i<state.friends.length; i++) {
      if(payload.userId === state.friends[i].friendId || payload.friendId === state.friends[i].friendId) {
        if(state.friends[i].messages) {
          console.log('ADD_FRIEND_MESSAGE',payload)
          state.friends[i].messages.push(payload)
        } else {
          Vue.set(state.friends[i], 'messages' , [payload])
        }
      }
    }
  },

  // 设置私聊记录
  [SET_FRIEND_MESSAGES](state, payload: FriendMessageDto[]) {
    console.log('friends', state.friends)
    if(payload.length) {
      for(let i=0;i<state.friends.length; i++) {
        if(payload[0].userId === state.friends[i].friendId || payload[0].friendId === state.friends[i].friendId) {
          // vuex对象数组中对象改变不更新问题
          console.log('SET_FRIEND_MESSAGES',i)
          Vue.set(state.friends[i], 'messages' , payload)
        }
      }
    }
  },

  // 设置当前聊天对象(群或好友)
  [SET_ACTIVE_ROOM](state, payload: FriendDto & GroupDto) {
    state.activeRoom = payload
  }
}

export default mutations;