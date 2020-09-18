export interface AppState {
  user: User;
  token: string;
  mobile: boolean;
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
};

export default appState;
