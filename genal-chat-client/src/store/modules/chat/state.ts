export interface ChatState {
  socket: any;
  groups: GroupDto[],
  friends: FriendDto[],
  activeRoom: GroupDto & FriendDto | null,
  groupGather: GroupGather,
  userGather: UserGather,
}

const chatState: ChatState = {
  socket: null,
  groups: [],
  friends: [],
  activeRoom: null,
  groupGather: {},
  userGather: {},
}

export default chatState;