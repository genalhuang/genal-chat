import cookie from 'js-cookie'
export function userInfo(state: any) {
  state.userInfo;
  if(!cookie.get('userInfo')) {
    return {}
  }
  return JSON.parse(cookie.get('userInfo') as any); 
  // return state.userInfo; 
}

export function groups() {

}
