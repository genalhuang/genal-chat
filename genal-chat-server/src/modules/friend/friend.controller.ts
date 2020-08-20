import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { FriendService } from './friend.service'
import { AuthGuard } from '@nestjs/passport';

@Controller('friend')
@UseGuards(AuthGuard('jwt'))
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @Get()
  getFriends(@Query('userId') userId: string) {
    return this.friendService.getFriends(userId)
  }

  @Get('/messages')
  getFriendMessage(@Query('userId') userId: string, @Query('friendId')friendId: string) {
    return this.friendService.getFriendMessages(userId, friendId)
  }
}
