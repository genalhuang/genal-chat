import { Injectable } from '@nestjs/common';
import { Repository, Connection, getRepository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Group, GroupMap } from './entity/group.entity';
import { GroupMessage } from './entity/groupMessage.entity'

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(GroupMap)
    private readonly guRepository: Repository<GroupMap>,
    @InjectRepository(GroupMessage)
    private readonly gmRepository: Repository<GroupMessage>,
  ) {}

  async getGroups(groupId: string) {
    try {
      let data;
      if(groupId) {
        data = await this.groupRepository.findOne({groupId: groupId})
        return {code: 0, messge:'获取单个群信息成功', data}
      }
      data = await this.groupRepository.find()
      return {code: 0, message:'获取系统所有群信息成功', data}
    } catch (e) {
      return {code: 1, message:'获取群失败',data: e}
    }
  }

  async getUserGroups(userId: string) {
    try {
      let data;
      if(userId) {
        data = await this.guRepository.find({userId: userId})
        return {code: 0, messge:'获取用户的所有群成功', data}
      }
      data = await this.guRepository.find()
      return {code: 0, message:'获取系统所有群成功', data}
    } catch (e) {
      return {code: 1, message:'获取用户的群失败',data: e}
    }
  }

  async getGroupUsers(groupId: string) {
    try {
      let data;
      if(groupId) {
        data = await this.guRepository.find({groupId: groupId})
        return {code: 0, messge:'获取群的所有用户成功', data}
      }
    } catch (e) {
      return {code: 1, message:'获取群的用户失败',data: e}
    }
  }

  async getGroupMessages(groupId: string) {
    try {
      let data;
      if(groupId) {
        data = await this.gmRepository.find({groupId: groupId})
        return {code: 0, message: '获取单个群消息成功', data}
      }
      return {code: 0, message: '获取所有群消息成功', data: await this.gmRepository.find()}
    } catch (e) {
      return {code: 1, message:'获取群消息失败', data: e}
    }
  }
}
