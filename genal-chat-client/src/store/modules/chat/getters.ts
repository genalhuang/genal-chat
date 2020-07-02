import { GetterTree } from 'vuex';
import { ChatState } from './state';
import { RootState } from '../../index'

const getters: GetterTree<ChatState, RootState> = {
  groups(state) {
    return state.groups;
  },
  friends(state) {
    return state.friends
  }
} 

export default getters;