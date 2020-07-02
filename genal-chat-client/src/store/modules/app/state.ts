export interface AppState {
  user: User
}

const appState: AppState = {
  user: {
    userId: '',
    username: '',
    password: '',
    avatar: '',
    createTime: 0
  }
}

export default appState;