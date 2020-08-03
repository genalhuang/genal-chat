import { SET_USER, CLEAR_USER } from './mutation-types';
import { AppState } from './state';
import cookie from 'js-cookie';
import { MutationTree } from 'vuex';

const mutations: MutationTree<AppState> = {
  [SET_USER](state, payload) {
    state.user = payload;
    // 数据持久化
    cookie.set('user', payload);
  },

  [CLEAR_USER](state, payload) {
    state.user = {
      userId: '',
      username: '',
      password: '',
      avatar: '',
      createTime: 0,
    };
    cookie.set('user', '');
  },
};

export default mutations;
