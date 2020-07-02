import { } from './mutation-types';
import { ActionTree } from 'vuex';
import { AppState } from './state';
import { RootState } from '../../index';
import fetch from '@/api/fetch';

const actions: ActionTree<AppState, RootState> = {
  async regist({commit}, payload) {
    let user = await fetch.post('/user', {
      ...payload
    })
    console.log(user)
  },
  async login({commit}, payload) {
    let user = await fetch.post('/user/login', {
      ...payload
    })
    console.log(user)
  }
}

export default actions;