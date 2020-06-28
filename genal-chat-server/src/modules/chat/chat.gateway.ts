import {Query} from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './entity/chat.entity';
import { User } from '../user/entity/user.entity';
import { Group } from '../group/entity/group.entity';
import { Body } from '@nestjs/common';
import { ChatDto } from './dto/chat.dto';
import { GroupDto } from '../group/dto/group.dto';
import set = Reflect.set;

@WebSocketGateway({ namespace: 'chat' })// 创建命名空间
export class ChatGateway {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
  ) {}

  @WebSocketServer()
  server: Server

  // socket连接钩子
  async handleConnection(client: Socket): Promise<string> {
    // 连接默认加入public房间
    await client.join('public')
    return '连接成功'
  }

  @SubscribeMessage('message')
  async sendMessage(@MessageBody() message: ChatDto): Promise<ChatDto | string> {
    const users = await this.groupRepository.find({
      name: message.name,
      group: message.group
    })
    if(!users.length) {
      return '消息认证失败'
    }
    await this.chatRepository.save(message)
    this.server.to(message.group).emit('message',message)
    return message
  }

  @SubscribeMessage('addGroupUser')
  addGroupUser(client:Socket, data: GroupDto) {
    client.join(data.group)
  }

  getMessages(group?: string): Promise<Chat[]> {
    if(!group) {
      return this.chatRepository.find()
    }
    return this.chatRepository.find({group: group})
  }
}
