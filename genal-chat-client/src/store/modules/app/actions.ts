import { SET_USER } from './mutation-types';
import { ActionTree } from 'vuex';
import { AppState } from './state';
import { RootState } from '../../index';
import fetch from '@/api/fetch';
import { processReturn } from '@/utils/common.ts';

const actions: ActionTree<AppState, RootState> = {
  async regist({ commit }, payload) {
    let res = await fetch.post('/user/regist', {
      ...payload,
    });
    let user = processReturn(res);
    if (user) {
      commit(SET_USER, user);
      return user;
    }
  },
  async login({ commit }, payload) {
    let res = await fetch.post('/user/login', {
      ...payload,
    });
    if (processReturn(res)) {
      commit(SET_USER, res.data.data);
      return res.data;
    }
  },
};

export default actions;
