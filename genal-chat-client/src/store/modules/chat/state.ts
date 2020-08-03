export interface ChatState {
  socket: any;
  activeRoom: (Group & Friend) | null;
  groupGather: GroupGather;
  userGather: FriendGather;
  friendGather: FriendGather;
}

const chatState: ChatState = {
  socket: null,
  activeRoom: null,
  groupGather: {},
  userGather: {},
  friendGather: {},
};

export default chatState;
