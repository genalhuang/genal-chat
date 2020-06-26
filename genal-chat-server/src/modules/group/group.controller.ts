import { Controller } from '@nestjs/common';
import { GroupGateway } from './group.gateway';

@Controller('group')
export class GroupController {
  constructor(private groupGateway: GroupGateway) {}
}
