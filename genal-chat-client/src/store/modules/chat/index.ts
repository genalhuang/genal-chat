import actions from './actions';
import mutations from './mutations';
import getters from './getters';
import state, { ChatState } from './state';
import { Module } from 'vuex';
import { RootState } from '../../index';

const chat: Module<ChatState, RootState> = {
  state,
  namespaced: true,
  mutations,
  actions,
  getters,
};

export default chat;