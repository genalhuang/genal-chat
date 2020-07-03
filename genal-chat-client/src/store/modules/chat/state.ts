export interface ChatState {
  socket: any;
  groups: GroupDto[],
  friends: FriendDto[],
  activeRoom: GroupDto & FriendDto | null,
}

const chatState: ChatState = {
  socket: null,
  groups: [],
  friends: [],
  activeRoom: null
}

export default chatState;