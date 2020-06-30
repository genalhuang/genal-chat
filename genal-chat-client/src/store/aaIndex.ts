import Vue from 'vue';
import Vuex, { ModuleTree } from 'vuex';

// app
import app from './modules/app';
import { AppState } from './modules/app/state'

export type RootState = {
  app: AppState;
}

Vue.use(Vuex);

const modules: ModuleTree<RootState> = {
  app
}

export default new Vuex.Store({
  modules
})
