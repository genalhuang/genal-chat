import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatGateway } from './chat.gateway';
import { ChatController } from './chat.controller';
import { User } from '../user/entity/user.entity';
import { Group } from '../group/entity/group.entity'
import { GroupMessage } from '../group/entity/groupMessage.entity'
import { Friend } from '../friend/entity/friend.entity'
import { FriendMessage } from '../friend/entity/friendMessage.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Group, GroupMessage, Friend, FriendMessage])
  ],
  providers: [ChatGateway],
  controllers: [ChatController],
})
export class ChatModule {}
