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
      const isHaveGroup = await this.groupRepository.find({groupname: data.groupname})
      if(isHaveGroup.length) {
        return this.server.to(data.userId).emit('addGroup', {code:1,data: '该房间已存在'})
      }

      data.groupId = uuidv4()
      client.join(data.groupId)
      const group = await this.groupRepository.save(data)
      console.log(group)
      this.server.to(group.groupId).emit('addGroup', {code: 0, data:group})
    } catch(e) {
      return { code: 1, data: e }
    }
  }

  // 加入群组房间
  @SubscribeMessage('joinGroup')
  async joinGroup(@ConnectedSocket() client: Socket, @MessageBody() data: Group) {
    try {
      const group = await this.groupRepository.findOne({groupname: data.groupname})
      const user = await this.userRepository.findOne({userId: data.userId})
      if(group && group.groupId) {
        data.groupId = group.groupId
        this.groupRepository.save(data)
        client.join(group.groupId)
        let res = { group: group, user: user}
        this.server.to(group.groupId).emit('joinGroup', {code: 0, data: res})
      }
    } catch(e) {
      return { code: 1, data: e }
    }
  }

  // 接收群消息
  @SubscribeMessage('groupMessage')
  async sendGroupMessage(@MessageBody() data: GroupMessage) {
    try {
      console.log(data)
      let isInGroup = await this.groupRepository.find({userId: data.userId, groupId: data.groupId})
      if(!isInGroup.length) {
        return this.server.to(data.groupId).emit('groupMessage',{code:1,data: '群消息发送错误'})
      } 
      if(data.groupId) {
        this.gmRepository.save(data);
        const user = this.userRepository.findOne({userId: data.userId})
        const res: any = {...data}
        res.user = user;
        this.server.to(data.groupId).emit('groupMessage', {code: 0, data: res})
      }
    } catch(e) {
      return this.server.to(data.groupId).emit('groupMessage',{ code: 1, data: e })
    }
  }

  // 添加好友
  @SubscribeMessage('addFriend')
  async addFriend(@ConnectedSocket() client: Socket, @MessageBody() data: Friend) {
    try {
      if(data.friendId && data.userId) {
        const isHave = await this.friendRepository.find({userId: data.userId, friendId: data.friendId})
        if(isHave.length) {
          this.server.emit('addFriend', {code: 1, data: '已经有该好友'})
          return;
        }
        const roomId = data.userId > data.friendId ?  data.userId + data.friendId : data.friendId + data.userId
        const friend = await this.userRepository.find({userId: data.friendId});
        if(!friend.length) {
          this.server.emit('addFriend', {code: 1, data: '该好友不存在'})
          return;
        }
        // 双方都添加好友 并存入数据库
        await this.friendRepository.save(data)
        const friendData = JSON.parse(JSON.stringify(data))
        const friendId = friendData.friendId
        friendData.friendId = friendData.userId
        friendData.userId = friendId
        delete friendData.id
        await this.friendRepository.save(friendData)
        client.join(roomId)
        this.server.emit('addFriend', {code: 0, data})
      }
    } catch(e) {
      return { code: 1, data: e }
    }
  }

  // 进入私聊房间
  @SubscribeMessage('joinFriend')
  async joinFriend(@ConnectedSocket() client: Socket, @MessageBody() data: Friend) {
    try {
      if(data.friendId && data.userId) {
        const roomId = data.userId > data.friendId ?  data.userId + data.friendId : data.friendId + data.userId
        client.join(roomId)
        // 通知被添加的一方加入房间成功
        this.server.to(data.friendId).emit('joinFriend', {code:1, data})
      }
    } catch(e) {
      return { code: 1, data: e }
    }
  }

  // 发送私聊消息
  @SubscribeMessage('friendMessage')
  async friendMessage(@MessageBody() data: FriendMessage) {
    try {
      if(data.from && data.to) {
        // console.log(data)
        const roomId = data.from > data.to ? data.from + data.to : data.to + data.from
        await this.fmRepository.save(data)
        this.server.to(roomId).emit('friendMessage', {code: 0, data})
      }
    } catch(e) {
      return { code: 1, data: e }
    }
  }
}
