import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entity/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Group, GroupMap } from '../group/entity/group.entity';
import { GroupMessage } from '../group/entity/groupMessage.entity';
import { UserMap } from '../friend/entity/friend.entity';
import { FriendMessage } from '../friend/entity/friendMessage.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Group, GroupMap, GroupMessage, UserMap, FriendMessage])
  ],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
