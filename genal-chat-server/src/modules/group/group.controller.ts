import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { GroupDto } from './dto/group.dto';
import { GroupService } from './group.service';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Get()
  getGroups() {
    return this.groupService.getGroups();
  }

  @Post()
  addGroups(@Body() group: GroupDto) {
    return this.groupService.addGroup(group);
  }

  @Get('/user')
  getUserToGroup(@Query('user') user: string) {
    console.log(user)
    return this.groupService.getUserToGroup(user)
  }

  @Get('/group')
  getGroupToUser(@Query('group') group: string) {
    console.log(group)
    return this.groupService.getGroupToUser(group)
  }
}
