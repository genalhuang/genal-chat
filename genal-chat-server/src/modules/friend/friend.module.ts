import { Module } from '@nestjs/common';
import { FriendController } from './friend.controller';
import { FriendService } from './friend.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserMap } from './entity/friend.entity';
import { FriendMessage } from './entity/friendMessage.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserMap, FriendMessage]),
  ],
  controllers: [FriendController],
  providers: [FriendService]
})
export class FriendModule {}
