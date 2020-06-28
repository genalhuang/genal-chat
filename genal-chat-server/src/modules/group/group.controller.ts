import { Controller, Get, Post, Body } from '@nestjs/common';
import { GroupGateway } from './group.gateway';
import { Group } from './entity/group.entity';

@Controller('group')
export class GroupController {
  constructor(private groupGateway: GroupGateway) {}

  @Get()
  getgroups() {
    return this.groupGateway.getGroup()
  }

}
