// 群组
interface GroupDto {
  groupId: string;
  userId: string; // 群主id
  groupName: string;
  notice: string;
  messages?: GroupMessageDto[];
  createTime: number;
}

// 群消息
interface GroupMessageDto {
  userId: string;
  groupId: string;
  content: string;
  width?: number;
  height?: number;
  messageType: string;
  time: number;
}

// 好友
interface FriendDto {
  userId: string;
  username: string;
  avatar: string;
  role?: string;
  tag?: string;
  messages?: FriendMessageDto[];
  createTime: number;
}

// 好友消息
interface FriendMessageDto {
  userId: string;
  friendId: string;
  content: string;
  width?: number;
  height?: number;
  messageType: string;
  time: number;
}