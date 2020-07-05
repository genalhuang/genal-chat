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
        data = await this.groupRepository.find({userId: userId})
        return {code: 0, messge:'获取用户的所有群成功', data}
      }
      data = await this.groupRepository.find()
      return {code: 0, message:'获取系统所有群成功', data}
    } catch (e) {
      return {code: 1, message:'获取群失败',data: e}
    }
  }

  async getGroupMessages(groupId: string) {
    try {
      let data;
      if(groupId) {
        data = await this.GroupMessageResponsity.find({groupId: groupId})
        return {code: 0, message: '获取单个群消息成功', data}
      }
      return {code: 0, message: '获取所有群消息成功', data: await this.GroupMessageResponsity.find()}
    } catch (e) {
      return {code: 1, message:'获取群消息失败', data: e}
    }
  }
}
