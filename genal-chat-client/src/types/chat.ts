declare module 'socket.io-client'

// 群组
interface GroupDto {
  groupId: string;
  userId: string;
  groupname: string;
  messages: GroupMessageDto[];
  createTime: string;
  type?: string;
}

// 群消息
interface GroupMessageDto {
  userId: string;
  groupId: string;
  content: string;
  time: string;
  type?: string;
}

// 好友
interface FriendDto {
  friendId: string;
  userId: string;
  messages: FriendMessageDto[];
  createTime: string;
  type?: string;
}

// 好友消息
interface FriendMessageDto {
  userId: string;
  friendId: string;
  content: string;
  time: string;
  type?: string;
}


interface SendMessageDto {
  type: string;
  message: string;
}


// 所有群的群信息
interface GroupGather {
  [userId:string]: GroupResponse
}

// 所有用户的用户信息
interface UserGather {
  [userId:string]: UserResponse
}

interface GroupResponse {
  groupId: string;
  userId: string;
  groupname: string;
  createTime: string;
}

interface UserResponse {
  userId: string;
  username: string;
  avatar: string;
  role?: string;
  tag?: string;
  createTime: number;
}