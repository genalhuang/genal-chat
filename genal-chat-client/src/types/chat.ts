declare module 'socket.io-client'

// 群组
interface GroupDto {
  groupId: string;
  userId: string;
  groupname: string;
  createTime: string;
  message?: GroupMessageDto[]
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
  createTime: string;
  message?: FriendMessageDto[]
}

interface FriendMessageDto {
  from: string;
  to: string;
  content: string;
  time: string;
}

