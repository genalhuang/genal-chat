import { Module } from '@nestjs/common';
import { FriendController } from './friend.controller';
import { FriendService } from './friend.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friend } from './entity/friend.entity'
import { FriendMessage } from './entity/friendMessage.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([Friend, FriendMessage]),
  ],
  controllers: [FriendController],
  providers: [FriendService]
})
export class FriendModule {}
