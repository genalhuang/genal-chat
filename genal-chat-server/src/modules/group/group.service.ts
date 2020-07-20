import { Injectable } from '@nestjs/common';
import { Repository, Connection, getRepository, Like } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Group, GroupMap } from './entity/group.entity';
import { GroupMessage } from './entity/groupMessage.entity'
import { getConnection } from "typeorm";

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

  async postGroups(groupIds: string) {
    try {
      if(groupIds) {
        let groupIdArr = groupIds.split(',');
        let groupArr = []
        for(let groupId of groupIdArr) {
          const data = await this.groupRepository.findOne({groupId: groupId})
          groupArr.push(data)
        }
        return {code: 0, message:'获取群信息成功', data: groupArr}
      }
      return {code: 1, message:'获取群信息失败', data: null}
    } catch (e) {
      return {code: 2, message:'获取群失败',data: e}
    }
  }

  async getUserGroups(userId: string) {
    try {
      let data;
      if(userId) {
        data = await this.guRepository.find({userId: userId})
        return {code: 0, message:'获取用户所有群成功', data}
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
        return {code: 0, message:'获取群的所有用户成功', data}
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
        return {code: 0, message: '获取群消息成功', data}
      }
      return {code: 0, message: '获取所有群消息成功', data: await this.gmRepository.find()}
    } catch (e) {
      return {code: 1, message:'获取群消息失败', data: e}
    }
  }

  async getGroupsByName(groupName: string) {
    try {
      if(groupName) {
        let groups = await this.groupRepository.find({groupName: Like(`%${groupName}%`)})
        return {code: 0, message:'获取群信息成功', data: groups}
      }
      return {code: 1, message:'请输入群昵称', data: null}
    } catch(e) {
      return {code: 2, message:'查找群错误', data: null}
    }
  }
}
