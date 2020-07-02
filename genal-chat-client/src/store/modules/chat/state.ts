export interface ChatState {
  groups: GroupDto[],
  friends: FriendDto[]
}

const chatState: ChatState = {
  groups: [],
  friends: []
}

export default chatState;