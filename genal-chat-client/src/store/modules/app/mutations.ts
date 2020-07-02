import { SET_USER, CLEAR_USER} from './mutation-types'
import { AppState } from './state';
import { MutationTree } from 'vuex';

const mutations: MutationTree<AppState> = {
  [SET_USER](state, payload) {
    state.user = payload
  },
  [CLEAR_USER](state, payload) {
    state.user = {
      userId: '',
      username: '',
      password: '',
      avatar: '',
      createTime: 0
    }
  }
}

export default mutations;