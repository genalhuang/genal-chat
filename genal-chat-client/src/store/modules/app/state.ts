export interface AppState {
  user: User;
  token: string;
  mobile: boolean;
  background: string;
}

const appState: AppState = {
  user: {
    userId: '',
    username: '',
    password: '',
    avatar: '',
    createTime: 0,
  },
  token: '',
  mobile: false,
  background: '',
};

export default appState;
