import { GetterTree } from 'vuex';
import { ChatState } from './state';
import { RootState } from '../../index'

const getters: GetterTree<ChatState, RootState> = {
  socket(state) {
    return state.socket
  },
  activeRoom(state) {
    return state.activeRoom
  },
  groupGather(state) {
    return state.groupGather
  },
  friendGather(state) {
    return state.friendGather
  },
  userGather(state) {
    return state.userGather
  },
} 

export default getters;
