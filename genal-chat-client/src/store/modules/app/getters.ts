import { GetterTree } from 'vuex';
import { AppState } from './state';
import { RootState } from '../../index'
import cookie from 'js-cookie'
const getters: GetterTree<AppState, RootState> = {
  user(state) {
    state.user
    let user = cookie.get('user')
    if(!user) {
      return {}
    }
    return JSON.parse(user)
  }
}

export default getters;