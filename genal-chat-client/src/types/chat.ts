declare module 'socket.io-client'

// 群组
interface GroupDto {
  groupId: string;
  userId: string;
  groupname: string;
  message?: GroupMessageDto[];
  createTime: string;
}

interface GroupMessageDto {
  userId: string;
  groupId: string;
  content: string;
  time: string;
}

// 私聊
interface FriendDto {
  friendId: string;
  userId: string;
  message?: FriendMessageDto[];
  createTime: string;
}

interface FriendMessageDto {
  from: string;
  to: string;
  content: string;
  time: string;
}

