import Vue from 'vue';
import {
  SET_SOCKET,
  SET_ACTIVE_GROUP_USER,
  ADD_GROUP_MESSAGE,
  SET_GROUP_MESSAGES,
  ADD_FRIEND_MESSAGE,
  SET_FRIEND_MESSAGES,
  SET_ACTIVE_ROOM,
  SET_GROUP_GATHER,
  SET_FRIEND_GATHER,
  SET_USER_GATHER,
  DEL_GROUP,
  DEL_FRIEND,
} from './mutation-types';
import { ChatState } from './state';
import { MutationTree } from 'vuex';

const mutations: MutationTree<ChatState> = {
  // 保存socket
  [SET_SOCKET](state, payload: any) {
    state.socket = payload;
  },

  // 设置群在线人数
  [SET_ACTIVE_GROUP_USER](state, payload: ActiveGroupUser) {
    state.activeGroupUser = payload;
  },

  // 新增一条群消息
  [ADD_GROUP_MESSAGE](state, payload: GroupMessage) {
    if (state.groupGather[payload.groupId].messages) {
      state.groupGather[payload.groupId].messages.push(payload);
    } else {
      // vuex对象数组中对象改变不更新问题
      Vue.set(state.groupGather[payload.groupId], 'messages', [payload]);
    }
  },

  // 设置群消息
  [SET_GROUP_MESSAGES](state, payload: GroupMessage[]) {
    if (payload && payload.length) {
      Vue.set(state.groupGather[payload[0].groupId], 'messages', payload);
    }
  },

  // 新增一条私聊消息
  [ADD_FRIEND_MESSAGE](state, payload: FriendMessage) {
    // @ts-ignore
    let userId = this.getters['app/user'].userId;
    if (payload.friendId === userId) {
      if (state.friendGather[payload.userId].messages) {
        state.friendGather[payload.userId].messages.push(payload);
      } else {
        Vue.set(state.friendGather[payload.userId], 'messages', [payload]);
      }
    } else {
      if (state.friendGather[payload.friendId].messages) {
        state.friendGather[payload.friendId].messages.push(payload);
      } else {
        Vue.set(state.friendGather[payload.friendId], 'messages', [payload]);
      }
    }
  },

  // 设置私聊记录
  [SET_FRIEND_MESSAGES](state, payload: FriendMessage[]) {
    // @ts-ignore
    let userId = this.getters['app/user'].userId;
    if (payload && payload.length) {
      if (payload[0].friendId === userId) {
        Vue.set(state.friendGather[payload[0].userId], 'messages', payload);
      } else {
        Vue.set(state.friendGather[payload[0].friendId], 'messages', payload);
      }
    }
  },

  // 设置当前聊天对象(群或好友)
  [SET_ACTIVE_ROOM](state, payload: Friend & Group) {
    state.activeRoom = payload;
  },

  // 设置所有的群的群详细信息(头像,群名字等)
  [SET_GROUP_GATHER](state, payload: Group) {
    Vue.set(state.groupGather, payload.groupId, payload);
  },

  // 设置所有的用户的用户详细信息(头像,昵称等)
  [SET_USER_GATHER](state, payload: User) {
    Vue.set(state.userGather, payload.userId, payload);
  },

  // 设置所有的好友的用户详细信息(头像,昵称等)
  [SET_FRIEND_GATHER](state, payload: User) {
    Vue.set(state.friendGather, payload.userId, payload);
  },

  // 退群
  [DEL_GROUP](state, payload: GroupMap) {
    Vue.delete(state.groupGather, payload.groupId);
  },

  // 删好友
  [DEL_FRIEND](state, payload: UserMap) {
    Vue.delete(state.friendGather, payload.friendId);
  },
};

export default mutations;
