import { Controller, Post, HttpCode, Get, Body, Query, Patch, Param, Delete } from '@nestjs/common';
import { GroupService } from './group.service'
import { Group } from './entity/group.entity';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Get()
  getGroups(@Query('userId') userId: string) {
    return this.groupService.getGroups(userId)
  }

  @Get('/messages')
  getGroupMessages(@Query('groupId') groupId: string) {
    return this.groupService.getGroupMessages(groupId);
  }

  @Post('/join')
  joinGroup(@Body() group:Group) {
    console.log(group)
    return this.groupService.joinGroup(group)
  }
}
