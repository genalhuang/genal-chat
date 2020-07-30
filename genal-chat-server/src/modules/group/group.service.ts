import { Injectable } from '@nestjs/common';
import { Repository, Like } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Group, GroupMap } from './entity/group.entity';
import { GroupMessage } from './entity/groupMessage.entity';
import { RCode } from 'src/common/constant/rcode';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(GroupMap)
    private readonly groupUserRepository: Repository<GroupMap>,
    @InjectRepository(GroupMessage)
    private readonly groupMessageRepository: Repository<GroupMessage>,
  ) {}

  async postGroups(groupIds: string) {
    if (groupIds) {
      let groupIdArr = groupIds.split(',');
      let groupArr = [];
      for (let groupId of groupIdArr) {
        const data = await this.groupRepository.findOne({ groupId: groupId });
        groupArr.push(data);
      }
      return { message: '获取群信息成功', data: groupArr };
    }
    return { code: RCode.FAIL, message: '获取群信息失败', data: null };
  }

  async getUserGroups(userId: string) {
    let data;
    if (userId) {
      data = await this.groupUserRepository.find({ userId: userId });
      return { message: '获取用户所有群成功', data };
    }
    data = await this.groupUserRepository.find();
    return { message: '获取系统所有群成功', data };
  }

  async getGroupUsers(groupId: string) {
    if (groupId) {
      let data = await this.groupUserRepository.find({ groupId: groupId });
      return { message: '获取群的所有用户成功', data };
    }
  }

  async getGroupMessages(groupId: string) {
    if (groupId) {
      let data = await this.groupMessageRepository.find({ groupId: groupId });
      return { message: '获取群消息成功', data };
    }
    return {
      message: '获取所有群消息成功',
      data: await this.groupMessageRepository.find(),
    };
  }

  async getGroupsByName(groupName: string) {
    if (groupName) {
      let groups = await this.groupRepository.find({
        groupName: Like(`%${groupName}%`),
      });
      return { data: groups };
    }
    return { code: RCode.FAIL, message: '请输入群昵称' };
  }
}
