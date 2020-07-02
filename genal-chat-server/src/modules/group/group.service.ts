import { Injectable } from '@nestjs/common';
import { Repository, Connection, getRepository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from './entity/group.entity';
import { GroupMessage } from './entity/groupMessage.entity'

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(GroupMessage)
    private readonly GroupMessageResponsity: Repository<GroupMessage>,
  ) {}

  async getGroups(userId: string) {
    try {
      if(userId) {
        return {code: 0, data: await this.groupRepository.find({userId: userId})}
      }
      return {code: 0, data:await this.groupRepository.find()}
    } catch (e) {
      return {code: 1, data: e}
    }
  }

  async getGroupMessages(groupId: string) {
    try {
      if(groupId) {
        return {code: 0, data: await this.GroupMessageResponsity.find({groupId: groupId})}
      }
      return {code: 0, data: await this.GroupMessageResponsity.find()}
    } catch (e) {
      return {code: 1, data: e}
    }
  }

  addGroup() {
    try {

    } catch (e) {
      return {code: 1, data: e}
    }
  }

  updateGroup() {
    try {

    } catch (e) {
      return {code: 1, data: e}
    }
  }

  delGroup() {
    try {

    } catch (e) {
      return {code: 1, data: e}
    }
  }
}
