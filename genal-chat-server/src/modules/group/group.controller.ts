import { Controller, Post, HttpCode, Get, Body, Query, Patch, Param, Delete } from '@nestjs/common';
import { GroupService } from './group.service'
import { Group } from './entity/group.entity';

@Controller('group')
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
}
