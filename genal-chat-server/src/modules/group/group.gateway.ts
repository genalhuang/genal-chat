import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server } from 'socket.io';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from '../chat/entity/chat.entity';
import { User } from '../user/entity/user.entity';
import { Group } from './entity/group.entity';

@WebSocketGateway({ namespace: 'group' })// 创建命名空间
export class GroupGateway {
  constructor(
    @InjectRepository(Chat)
    private readonly messageRepository: Repository<Chat>,
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
  async identity(@MessageBody() data: any) {
    // await this.messageRepository.save(data)
    console.log(data)
    this.server.emit('message',data)
  }

}

