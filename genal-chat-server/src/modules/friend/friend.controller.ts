import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { FriendService } from './friend.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('friend')
@UseGuards(AuthGuard('jwt'))
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @Get()
  getFriends(@Query('userId') userId: string) {
    return this.friendService.getFriends(userId);
  }

  @Get('/friendMessages')
  getFriendMessage(@Query() query: any) {
    return this.friendService.getFriendMessages(query.userId, query.friendId, query.current, query.pageSize);
  }
}
