import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
  ConnectedSocket
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../user/entity/user.entity';
import { Group } from '../group/entity/group.entity'
import { GroupMessage } from '../group/entity/groupMessage.entity'
import { Friend } from '../friend/entity/friend.entity'
import { FriendMessage } from '../friend/entity/friendMessage.entity'


@WebSocketGateway({namespace:'chat'})
export class ChatGateway {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(GroupMessage)
    private readonly gmRepository: Repository<GroupMessage>,
    @InjectRepository(Friend)
    private readonly friendRepository: Repository<Friend>,
    @InjectRepository(FriendMessage)
    private readonly fmRepository: Repository<FriendMessage>,
  ) {}

  @WebSocketServer()
  server: Server

  // socket连接钩子
  async handleConnection(client: Socket): Promise<string> {
    let userRoom = client.handshake.query.userId
    const defaultGroup = await this.groupRepository.find({groupname: 'public'})
    if(!defaultGroup.length) {
      this.groupRepository.save({
        groupId: 'public',
        groupname: 'public',
        userId: 'admin',
        createTime: new Date().valueOf()
      })
    }
    // 连接默认加入public房间
    client.join('public')
    // 用户独有消息房间 根据userId
    if(userRoom) {
      client.join(userRoom)
    }
    return '连接成功'
  }

  // 创建群组
  @SubscribeMessage('addGroup')
  async addGroup(@ConnectedSocket() client: Socket, @MessageBody() data: Group){
    try {
      const isHaveGroup = await this.groupRepository.findOne({groupname: data.groupname})
      if(isHaveGroup) {
        return this.server.to(data.userId).emit('addGroup', {code:1, message: '该房间已存在', data: isHaveGroup})
      }
      data.groupId = uuidv4()
      client.join(data.groupId)
      const group = await this.groupRepository.save(data)
      console.log(group)
      this.server.to(group.groupId).emit('addGroup', {code: 0, message: `成功创建群${data.groupname}`, data:group})
    } catch(e) {
      this.server.to(data.userId).emit('addGroup', {code: 2, message:'创建群失败', data:e})
    }
  }

  // 加入群组
  @SubscribeMessage('joinGroup')
  async joinGroup(@ConnectedSocket() client: Socket, @MessageBody() data: Group) {
    try {
      const group = await this.groupRepository.findOne({groupname: data.groupname})
      let userGroup = await this.groupRepository.findOne({groupname: data.groupname, userId: data.userId})
      const user = await this.userRepository.findOne({userId: data.userId})
      if(group) {
        if(!userGroup) {
          data.groupId = group.groupId
          userGroup = await this.groupRepository.save(data)
        }
        client.join(group.groupId)
        let res = { group: userGroup, user: user}
        this.server.to(group.groupId).emit('joinGroup', {code: 0, message:`${user.username}加入群${group.groupname}`, data: res})
      } else {
        this.server.to(data.userId).emit('joinGroup', {code:1, message:'该群不存在', data:''})
      }
    } catch(e) {
      this.server.to(data.userId).emit('joinGroup', {code:2, message:'进群失败', data:e})
    }
  }

  // 加入群组的socket连接
  @SubscribeMessage('joinGroupSocket')
  async joinGroupSocket(@ConnectedSocket() client: Socket, @MessageBody() data: Group) {
    try {
      const group = await this.groupRepository.findOne({groupname: data.groupname})
      let userGroup = await this.groupRepository.findOne({groupname: data.groupname, userId: data.userId})
      const user = await this.userRepository.findOne({userId: data.userId})
      if(group) {
        client.join(group.groupId)
        let res = { group: userGroup, user: user}
        this.server.to(group.groupId).emit('joinGroupSocket', {code: 0, message:`${user.username}加入群${group.groupname}`, data: res})
      } else {
        this.server.to(data.userId).emit('joinGroupSocket', {code:1, message:'该群不存在', data:''})
      }
    } catch(e) {
      this.server.to(data.userId).emit('joinGroupSocket', {code:2, message:'进群失败', data:e})
    }
  }





  // 发送群消息
  @SubscribeMessage('groupMessage')
  async sendGroupMessage(@MessageBody() data: GroupMessage) {
    try {
      console.log(data)
      let isUserInGroup = await this.groupRepository.findOne({userId: data.userId, groupId: data.groupId})
      if(!isUserInGroup) {
        return this.server.to(data.userId).emit('groupMessage',{code:1, message:'群消息发送错误', data: ''})
      } 
      if(data.groupId) {
        this.gmRepository.save(data);
        this.server.to(data.groupId).emit('groupMessage', {code: 0, message:'', data: data})
      }
    } catch(e) {
      return this.server.to(data.userId).emit('groupMessage',{ code: 2, message:'群消息发送错误', data: e })
    }
  }

  // 添加好友
  @SubscribeMessage('addFriend')
  async addFriend(@ConnectedSocket() client: Socket, @MessageBody() data: Friend) {
    try {
      if(data.friendId && data.userId) {
        if(data.userId === data.friendId) {
          return this.server.to(data.userId).emit('addFriend', {code: 1, message:'不能添加自己为好友', data: ''})
        }
        const isHave1 = await this.friendRepository.find({userId: data.userId, friendId: data.friendId})
        const isHave2 = await this.friendRepository.find({userId: data.friendId, friendId: data.userId})
        const roomId = data.userId > data.friendId ?  data.userId + data.friendId : data.friendId + data.userId

        if(isHave1.length || isHave2.length) {
          this.server.emit('addFriend', {code: 1, message:'已经有该好友', data: data})
          return;
        }

        const friend = await this.userRepository.findOne({userId: data.friendId});
        const user = await this.userRepository.findOne({userId: data.userId})
        if(!friend) {
          this.server.to(data.userId).emit('addFriend', {code: 1, message:'该好友不存在', data: ''})
          return;
        }

        // 双方都添加好友 并存入数据库
        let userChat = await this.friendRepository.save(data)
        let friendData = JSON.parse(JSON.stringify(data))
        const friendId = friendData.friendId
        friendData.friendId = friendData.userId
        friendData.userId = friendId
        delete friendData._id
        let friendChat = await this.friendRepository.save(friendData)
        client.join(roomId)
        this.server.to(data.userId).emit('addFriend', {code: 0, message:'添加好友成功', data: {user:friend, chat: userChat}})
        this.server.to(data.friendId).emit('addFriend', {code: 0, message:'你正被一个人添加', data: {user, chat: friendChat}})
      }
    } catch(e) {
      return { code: 2, message:'添加好友失败', data: e }
    }
  }

  // 进入私聊房间
  @SubscribeMessage('joinFriend')
  async joinFriend(@ConnectedSocket() client: Socket, @MessageBody() data: Friend) {
    try {
      console.log('joinFriend',data)
      if(data.friendId && data.userId) {
        const isUserInFriend = await this.friendRepository.findOne({ userId: data.userId, friendId: data.friendId })
        let roomId = data.userId > data.friendId ?  data.userId + data.friendId : data.friendId + data.userId
        if(isUserInFriend) {
          client.join(roomId)
          this.server.to(data.userId).emit('joinFriend',{code:0, message:'进入私聊socket成功', data: isUserInFriend })
          this.server.to(data.friendId).emit('joinFriend',{code:0, message:'进入私聊socket成功', data: isUserInFriend})
          return 
        } 
      }
    } catch(e) {
      this.server.to(data.userId).emit('joinFriend',{ code:1, message:'进入私聊socket失败', data: e })
    }
  }

  // 发送私聊消息
  @SubscribeMessage('friendMessage')
  async friendMessage(@ConnectedSocket() client: Socket, @MessageBody() data: FriendMessage) {
    try {
      console.log('friendMessage',data)
      if(data.userId && data.friendId) {
        let roomId = data.userId > data.friendId ? data.userId + data.friendId : data.friendId + data.userId
        client.join(roomId)
        await this.fmRepository.save(data)
        this.server.to(roomId).emit('friendMessage', {code: 0, message:'', data})
      }
    } catch(e) {
      this.server.to(data.userId).emit('friendMessage', {code: 2, message:'消息发送失败', data})
    }
  }
}
