import { SET_USER, CLEAR_USER, SET_TOKEN, SET_MOBILE, SET_BACKGROUND } from './mutation-types';
import { AppState } from './state';
import cookie from 'js-cookie';
import { MutationTree } from 'vuex';

const mutations: MutationTree<AppState> = {
  [SET_USER](state, payload: User) {
    state.user = payload;
    // 数据持久化
    cookie.set('user', payload, { expires: 3650 });
  },

  [CLEAR_USER](state) {
    state.user = {
      userId: '',
      username: '',
      password: '',
      avatar: '',
      createTime: 0,
    };
    cookie.set('user', '');
  },

  [SET_TOKEN](state, payload) {
    state.token = payload;
    cookie.set('token', payload, { expires: 3 });
  },

  [SET_MOBILE](state, payload: boolean) {
    state.mobile = payload;
  },

  [SET_BACKGROUND](state, payload: string) {
    state.background = payload;
    localStorage.setItem('background', payload);
  },
};

export default mutations;
