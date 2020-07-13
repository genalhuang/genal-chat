declare module 'socket.io-client'

// 所有群的群信息
interface GroupGather {
  [groupId:string]: Group
}

// 群组
interface Group {
  groupId: string;
  userId: string; // 群主id
  groupName: string;
  notice: string;
  messages: GroupMessage[];
  createTime: number;
}

// 群与用户关联表
interface GroupMap {
  groupId: string;
  userId: string;
}

// 群消息
interface GroupMessage {
  userId: string;
  groupId: string;
  content: string;
  time: string;
}

// 所有好友的好友信息
interface FriendGather {
  [userId:string]: Friend
}

// 好友
interface Friend {
  userId: string;
  username: string;
  avatar: string;
  role?: string;
  tag?: string;
  messages: FriendMessage[];
  createTime: string;
}

// 用户与好友关联表
interface UserMap {
  userId: string;
  friendId: string;
}

// 好友消息
interface FriendMessage {
  userId: string;
  friendId: string;
  content: string;
  time: string;
  type?: string;
}

interface SendMessage {
  type: string;
  message: string;
}







