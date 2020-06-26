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

// @WebSocketGateway({ namespace: 'events' })// 创建命名空间
@WebSocketGateway()
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  // socket连接钩子
  handleConnection(client) {
    return '连接成功'
  }


  @SubscribeMessage('message')
  async identity(@MessageBody() data: any) {
    this.server.emit('message',data)
  }

  @SubscribeMessage('addUser')
  addUser( @MessageBody() user:any) {
    console.log(user)
    this.server.emit('addUser', user)
    return user
  }
}
