export interface ChatState {
  socket: any;
  groups: GroupDto[],
  friends: FriendDto[],
  activeChat: GroupDto | FriendDto | null,
}

const chatState: ChatState = {
  socket: null,
  groups: [],
  friends: [],
  activeChat: null
}

export default chatState;