import { SET_USER } from './mutation-types';
import { ActionTree } from 'vuex';
import { AppState } from './state';
import { RootState } from '../../index';
import fetch from '@/api/fetch';

const actions: ActionTree<AppState, RootState> = {
  async regist({commit}, payload) {
    let res = await fetch.post('/user', {
      ...payload
    })
    if(res.data.code === 0) {
      commit(SET_USER, res.data.data)
    }
    return res.data
  },
  async login({commit}, payload) {
    let res = await fetch.post('/user/login', {
      ...payload
    })
    if(res.data.code === 0) {
      console.log(res.data.data)
      commit(SET_USER, res.data.data)
    }
    return res.data
  }
}

export default actions;