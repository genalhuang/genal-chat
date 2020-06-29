import { SET_USER_INFO, DEL_USER_INFO, CHANGE_SHOW_LOGIN_MODAL } from './mutation-types'
import cookie from 'js-cookie'
export default {
  [SET_USER_INFO](state: any, payload: any) {
    state.role = payload;
    cookie.set('userInfo', payload)
  },
  [DEL_USER_INFO](state: any) {
    state.userInfo = {}
    cookie.set('userInfo', {})
  },
  [CHANGE_SHOW_LOGIN_MODAL](state: any, payload: any) {
    state.showLoginModal = payload;
  }
}
