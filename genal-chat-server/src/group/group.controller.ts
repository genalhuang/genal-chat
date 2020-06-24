import { Controller, Get, Post, Body } from '@nestjs/common';
import { GroupDto } from './dto/group.dto'
import { GroupService } from './group.service';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Get()
  getGroups() {
    return this.groupService.getGroups()
  }

  @Post()
  addGroups(@Body() group: GroupDto) {
    return this.groupService.addGroup(group)
  }
}
