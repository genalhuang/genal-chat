declare module 'socket.io-client'

// 群组
interface GroupDto {
  groupId: string;
  userId: string;
  groupname: string;
  messages: GroupMessageDto[];
  createTime: string;
}

// 群消息
interface GroupMessageDto {
  userId: string;
  groupId: string;
  content: string;
  time: string;
}

// 好友
interface FriendDto {
  friendId: string;
  userId: string;
  messages: FriendMessageDto[];
  createTime: string;
}

// 好友消息
interface FriendMessageDto {
  from: string;
  to: string;
  content: string;
  time: string;
}
