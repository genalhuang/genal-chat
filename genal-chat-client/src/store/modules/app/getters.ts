import { GetterTree } from 'vuex';
import { AppState } from './state';
import { RootState } from '../../index'

const getters: GetterTree<AppState, RootState> = {
  user(state) {
    return state.user
  }
}

export default getters;