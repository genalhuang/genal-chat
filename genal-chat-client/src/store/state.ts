export interface State {
  userInfo: {
    name: string;
    password: string;
    avatar?: string
  };
}

const state: State = {
  userInfo: {
    name: '',
    password: ''
  }
};

export default state;
