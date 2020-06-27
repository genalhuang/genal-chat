import cookie from 'js-cookie'
export function userInfo(state: any) {
  state.userInfo;
  return JSON.parse(cookie.get('userInfo'));
}