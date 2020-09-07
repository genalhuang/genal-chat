export interface ChatState {
  socket: SocketIOClient.Socket;
  activeGroupUser: ActiveGroupUser;
  activeRoom: (Group & Friend) | null;
  groupGather: GroupGather;
  userGather: FriendGather;
  friendGather: FriendGather;
}

const chatState: ChatState = {
  // @ts-ignore
  socket: null,
  activeGroupUser: {},
  activeRoom: null,
  groupGather: {},
  userGather: {},
  friendGather: {},
};

export default chatState;
