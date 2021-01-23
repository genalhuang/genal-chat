// 群组
interface GroupDto {
  groupId: number;
  userId: number; // 群主id
  groupName: string;
  notice: string;
  messages?: GroupMessageDto[];
  createTime: number;
}

// 群消息
interface GroupMessageDto {
  userId: number;
  groupId: number;
  content: string;
  width?: number;
  height?: number;
  messageType: string;
  time: number;
}

// 好友
interface FriendDto {
  userId: number;
  username: string;
  avatar: string;
  role?: string;
  tag?: string;
  messages?: FriendMessageDto[];
  createTime: number;
}

// 好友消息
interface FriendMessageDto {
  userId: number;
  friendId: number;
  content: string;
  width?: number;
  height?: number;
  messageType: string;
  time: number;
}
