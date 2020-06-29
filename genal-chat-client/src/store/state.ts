export interface State {
  userInfo: {
    name: string;
    password: string;
    avatar?: string
  };
  showLoginModal: boolean
}

const state: State = {
  userInfo: {
    name: '',
    password: ''
  },
  showLoginModal: false
};

export default state;
