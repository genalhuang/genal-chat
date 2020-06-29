import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from '../chat/entity/chat.entity';
import { User } from '../user/entity/user.entity';
import { Group } from '../group/entity/group.entity';
import { UserDto } from './dto/user.dto';
import { Body } from '@nestjs/common';

@WebSocketGateway({ namespace: 'user' })// 创建命名空间
export class UserGateway {
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

  async addUser( @Body() user: UserDto) {
    console.log(user)
    // 用户信息校验
    const name = await this.userRepository.find({name: user.name})
    const password = await this.userRepository.find({name: user.name, password: user.password})
    if(name.length && !password.length) {
      return '密码错误'
    }
    // 保存用户信息到用户数据库中
    const users = await this.userRepository.find({name: user.name, password: user.password})
    if(!users.length) {
      await this.userRepository.save(user)
    }
    // 默认让用户进入public群
    const groups = await this.groupRepository.find({group: 'public',name: user.name})
    if(!groups.length) {
      await this.groupRepository.save({
        name: user.name,
        group: 'public'
      })
    }

    return user
  }

  getUsers() {
    return this.userRepository.find()
  }

}

