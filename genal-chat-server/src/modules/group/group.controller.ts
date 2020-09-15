import { Controller, Post, Get, Body, Query, UseGuards } from '@nestjs/common';
import { GroupService } from './group.service'
import { AuthGuard } from '@nestjs/passport';

@Controller('group')
@UseGuards(AuthGuard('jwt'))
export class GroupController {
  constructor(private readonly groupService: GroupService) {}


  @Post()
  postGroups(@Body('groupIds') groupIds: string) {
    return this.groupService.postGroups(groupIds)
  }
  
  @Get('/userGroup')
  getUserGroups(@Query('userId') userId: string) {
    return this.groupService.getUserGroups(userId)
  }

  @Get('/groupUser')
  getGroupUsers(@Query('groupId') groupId: string) {
    return this.groupService.getGroupUsers(groupId)
  }

  @Get('/messages')
  getGroupMessages(@Query('groupId') groupId: string) {
    return this.groupService.getGroupMessages(groupId);
  }

  @Get('/findByName')
  getGroupsByName(@Query('groupName') groupName: string) {
    return this.groupService.getGroupsByName(groupName);
  }
}
