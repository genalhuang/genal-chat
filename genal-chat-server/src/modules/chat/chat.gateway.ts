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
import { User } from '../user/entity/user.entity';

import set = Reflect.set;

@WebSocketGateway({ namespace: 'chat' })// 创建命名空间
export class ChatGateway {
  constructor(
    // @InjectRepository(Chat)
    // private readonly chatRepository: Repository<Chat>
  ) {}

  @WebSocketServer()
  server: Server

  // socket连接钩子
  async handleConnection(client: Socket): Promise<string> {
    // 连接默认加入public房间
    await client.join('public')
    return '连接成功'
  }

}
