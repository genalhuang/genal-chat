import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { GroupGateway } from './group.gateway';
import { Group } from './entity/group.entity';

@Controller('group')
export class GroupController {
  constructor(private groupGateway: GroupGateway) {}

  @Get()
  getgroups(@Query('name') name: string) {
    return this.groupGateway.getGroup(name)
  }

}
