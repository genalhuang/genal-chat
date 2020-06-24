import { Injectable } from '@nestjs/common';
import { Group } from './entity/group.entity'
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GroupDto } from './dto/group.dto';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>
  ) {}

  getGroups() {
    return this.groupRepository.find()
  }

  addGroup(Group: GroupDto) {
    return this.groupRepository.save(Group)
  }

}
