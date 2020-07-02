export interface ChatState {
  socket: any;
  groups: GroupDto[],
  friends: FriendDto[]
}

const chatState: ChatState = {
  socket: null,
  groups: [],
  friends: []
}

export default chatState;