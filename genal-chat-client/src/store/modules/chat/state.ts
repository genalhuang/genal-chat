export interface ChatState {
  socket: any;
  groups: GroupDto[],
  friends: FriendDto[],
  activeRoom: GroupDto & FriendDto | null,
  userGather: UserGather
}

const chatState: ChatState = {
  socket: null,
  groups: [],
  friends: [],
  activeRoom: null,
  userGather: {}
}

export default chatState;