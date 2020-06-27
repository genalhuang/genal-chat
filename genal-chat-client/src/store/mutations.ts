import { SET_USER_INFO } from './mutation-types'
import cookie from 'js-cookie'
export default {
  [SET_USER_INFO](state: any, payload: any) {
    state.role = payload;
    cookie.set('userInfo', payload)
  }
}