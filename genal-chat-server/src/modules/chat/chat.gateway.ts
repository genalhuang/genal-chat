import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './entity/chat.entity';
import { User } from '../user/entity/user.entity';
import { Group } from '../group/entity/group.entity';
import { Body } from '@nestjs/common';
import { ChatDto } from './dto/chat.dto';

@WebSocketGateway({ namespace: 'chat' })// 创建命名空间
// @WebSocketGateway()
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
  handleConnection(client) {
    return '连接成功'
  }

  @SubscribeMessage('message')
  async sendMessage(@Body() message: ChatDto) {
    console.log(message,123412)
    const users = await this.userRepository.find({name: message.name})
    if(!users.length) {
      return '兄弟, 你哪里来的, 我没有这个用户'
    }
    await this.chatRepository.save(message)
    console.log(message)
    this.server.emit('message',message)
    return message
  }

  getMessages() {
    return this.chatRepository.find()
  }
}
