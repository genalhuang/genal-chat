import { Injectable } from '@nestjs/common';
import { Repository, Like } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Group, GroupMap } from '../group/entity/group.entity';
import { createWriteStream } from 'fs';
import { join } from 'path';
import { RCode } from 'src/common/constant/rcode';
import { GroupMessage } from '../group/entity/groupMessage.entity';
import { UserMap } from '../friend/entity/friend.entity';
import { FriendMessage } from '../friend/entity/friendMessage.entity';
import { nameVerify, passwordVerify } from 'src/common/tool/utils';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(GroupMap)
    private readonly groupUserRepository: Repository<GroupMap>,
    @InjectRepository(GroupMessage)
    private readonly groupMessageRepository: Repository<GroupMessage>,
    @InjectRepository(UserMap)
    private readonly friendRepository: Repository<UserMap>,
    @InjectRepository(FriendMessage)
    private readonly friendMessageRepository: Repository<FriendMessage>,
  ) {}

  async getUser(userId: string) {
    try {
      let data;
      if(userId) {
        data = await this.userRepository.findOne({
          where:{userId: userId}
        });
        return { msg:'获取用户成功', data };
      }
    } catch(e) {
      return { code: RCode.ERROR , msg:'获取用户失败', data: e };
    }
  }

  async postUsers(userIds: string) {
    try {
      if(userIds) {
        const userIdArr = userIds.split(',');
        const userArr = [];
        for(const userId of userIdArr) {
          if(userId) {
            const data = await this.userRepository.findOne({
              where:{userId: userId}
            });
            userArr.push(data);
          }
        }
        return { msg:'获取用户信息成功', data: userArr};
      }
      return {code: RCode.FAIL, msg:'获取用户信息失败', data: null };
    } catch(e) {
      return { code: RCode.ERROR , msg:'获取用户信息失败', data: e };
    }
  }

  async updateUserName(user: User) {
    try {
      const oldUser = await this.userRepository.findOne({userId: user.userId, password: user.password});
      if(oldUser && nameVerify(user.username)) {
        const isHaveName = await this.userRepository.findOne({username: user.username});
        if(isHaveName) {
          return {code: 1, msg:'用户名重复', data: ''};
        }
        const newUser = JSON.parse(JSON.stringify(oldUser));
        newUser.username = user.username;
        newUser.password = user.password;
        await this.userRepository.update(oldUser,newUser);
        return { msg:'更新用户名成功', data: newUser};
      }
      return {code: RCode.FAIL, msg:'更新失败', data: '' };
    } catch(e) {
      return {code: RCode.ERROR, msg: '更新用户名失败', data: e };
    }
  }

  async updatePassword(user: User, password: string) {
    try {
      const oldUser = await this.userRepository.findOne({userId: user.userId, username: user.username, password: user.password});
      if(oldUser && passwordVerify(password)) {
        const newUser = JSON.parse(JSON.stringify(oldUser));
        newUser.password = password;
        await this.userRepository.update(oldUser, newUser);
        return { msg:'更新用户密码成功', data: newUser};
      } 
      return {code: RCode.FAIL, msg:'更新失败', data: '' };
    } catch(e) {
      return {code: RCode.ERROR, msg: '更新用户密码失败', data: e };
    }
  }

  async jurisdiction(userId: string) {
    const user = await this.userRepository.findOne({userId: userId});
    const newUser = JSON.parse(JSON.stringify(user));
    if(user.username === '陈冠希') {
      newUser.role = 'admin';
      await this.userRepository.update(user,newUser);
      return { msg:'更新用户信息成功', data: newUser};
    }
  }

  async delUser(uid: string, psw: string, did: string) {
    try {
      const user = await this.userRepository.findOne({userId: uid, password: psw});
      if(user.role === 'admin' && user.username === '陈冠希') {
        // 被删用户自己创建的群
        const groups = await this.groupRepository.find({userId: did});
        for(const group of groups) {
          await this.groupRepository.delete({groupId: group.groupId});
          await this.groupUserRepository.delete({groupId: group.groupId});
          await this.groupMessageRepository.delete({groupId: group.groupId});
        }
        // 被删用户加入的群
        await this.groupUserRepository.delete({userId: did});
        await this.groupMessageRepository.delete({userId: did});
        // 被删用户好友
        await this.friendRepository.delete({userId: did});
        await this.friendRepository.delete({friendId: did});
        await this.friendMessageRepository.delete({userId: did});
        await this.friendMessageRepository.delete({friendId: did});
        await this.userRepository.delete({userId: did});
        return { msg: '用户删除成功'};
      }
      return {code: RCode.FAIL, msg:'用户删除失败'};
    } catch(e) {
      return {code: RCode.ERROR, msg:'用户删除失败', data: e};
    }
  }

  async getUsersByName(username: string) {
    try {
      if(username) {
        const users = await this.userRepository.find({
          where:{username: Like(`%${username}%`)}
        });
        return { data: users };
      }
      return {code: RCode.FAIL, msg:'请输入用户名', data: null};
    } catch(e) {
      return {code: RCode.ERROR, msg:'查找用户错误', data: null};
    }
  }

  async setUserAvatar(user: User, file) {
    const newUser = await this.userRepository.findOne({userId: user.userId, password: user.password});
    if(newUser) {
      const random = Date.now() + '&';
      const stream = createWriteStream(join('public/avatar', random + file.originalname));
      stream.write(file.buffer);
      newUser.avatar = `api/avatar/${random}${file.originalname}`;
      newUser.password = user.password;
      await this.userRepository.save(newUser);
      return { msg: '修改头像成功', data: newUser};
    } else {
      return {code: RCode.FAIL, msg: '修改头像失败'};
    }
  }
}
