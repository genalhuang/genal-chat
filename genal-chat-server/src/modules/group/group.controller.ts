import { Controller, Post, HttpCode, Get, Body, Query, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { GroupService } from './group.service'
import { Group } from './entity/group.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  postGroups(@Body('groupIds') groupIds: string) {
    return this.groupService.postGroups(groupIds)
  }
  
  @UseGuards(AuthGuard('jwt'))
  @Get('/userGroup')
  getUserGroups(@Query('userId') userId: string) {
    return this.groupService.getUserGroups(userId)
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/groupUser')
  getGroupUsers(@Query('groupId') groupId: string) {
    return this.groupService.getGroupUsers(groupId)
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/messages')
  getGroupMessages(@Query('groupId') groupId: string) {
    return this.groupService.getGroupMessages(groupId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/findByName')
  getGroupsByName(@Query('groupName') groupName: string) {
    return this.groupService.getGroupsByName(groupName);
  }
}
