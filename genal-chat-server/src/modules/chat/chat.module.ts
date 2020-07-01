import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatGateway } from './chat.gateway';
import { ChatController } from './chat.controller';
import { User } from '../user/entity/user.entity';
import { Group } from './entity/group.entity'
import { GroupMessage } from './entity/groupMessage.entity'
import { Friend } from './entity/friend.entity'
import { FriendMessage } from './entity/friendMessage.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Group]),
    TypeOrmModule.forFeature([GroupMessage]),
    TypeOrmModule.forFeature([Friend]),
    TypeOrmModule.forFeature([FriendMessage]),
  ],
  providers: [ChatGateway],
  controllers: [ChatController],
})
export class ChatModule {}
