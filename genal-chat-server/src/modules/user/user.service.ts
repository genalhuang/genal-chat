import { Injectable } from '@nestjs/common';
import { Repository, Like } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { GroupMap } from '../group/entity/group.entity';
import { createWriteStream } from 'fs';
import { join } from 'path';
import { RCode } from 'src/common/constant/rcode';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(GroupMap)
    private readonly groupUserRepository: Repository<GroupMap>,
  ) {}

  async getUser(userId: string) {
    let data;
    if (userId) {
      data = await this.userRepository.findOne({
        select: ['userId', 'username', 'avatar', 'role', 'tag', 'createTime'],
        where: { userId: userId },
      });
      return { message: '获取用户成功', data };
    }
    data = await this.userRepository.find();
    return { message: '获取所有用户成功', data };
  }

  async postUsers(userIds: string) {
    if (userIds) {
      let userIdArr = userIds.split(',');
      let userArr = [];
      for (let userId of userIdArr) {
        if (userId) {
          const data = await this.userRepository.findOne({
            select: [
              'userId',
              'username',
              'avatar',
              'role',
              'tag',
              'createTime',
            ],
            where: { userId: userId },
          });
          userArr.push(data);
        }
      }
      return { message: '获取用户信息1成功', data: userArr };
    }
    return { code: RCode.FAIL, message: '获取用户信息失败' };
  }

  async addUser(user: User) {
    let isHave = await this.userRepository.find({ username: user.username });
    if (isHave.length) {
      return { code: RCode.FAIL, message: '用户名重复' };
    }

    let index = Math.round(Math.random() * 19 + 1);
    user.avatar = `static/avatar(${index}).png`;

    const data = await this.userRepository.save(user);

    await this.groupUserRepository.save({
      userId: data.userId,
      groupId: 'public',
    });

    return { message: '注册成功', data };
  }

  async updateUser(userId: string, user: User) {
    const oldUser = await this.userRepository.findOne({ userId: userId });
    console.log(userId);
    if (user.password === oldUser.password) {
      const isHaveName = await this.userRepository.findOne({
        username: user.username,
      });
      if (isHaveName) {
        return { code: RCode.FAIL, message: '用户名重复' };
      }
      await this.userRepository.update(oldUser, user);
      let newUser = await this.userRepository.findOne({ userId: userId });
      return { message: '更新用户信息成功', data: newUser };
    }
    return { code: RCode.FAIL, message: '密码错误' };
  }

  async delUser(userId: string) {
    const data = await this.userRepository.delete({ userId: userId });
    return { message: '用户删除成功', data };
  }

  async login(user: { username: string; password: string }) {
    const data = await this.userRepository.findOne({
      username: user.username,
      password: user.password,
    });
    if (!data) {
      return { code: RCode.FAIL, message: '密码错误' };
    }
    return { message: '登录成功', data: data };
  }

  async getUsersByName(username: string) {
    if (username) {
      let users = await this.userRepository.find({
        select: ['userId', 'username', 'avatar', 'role', 'tag', 'createTime'],
        where: { username: Like(`%${username}%`) },
      });
      return { data: users };
    }
    return { code: RCode.FAIL, message: '请输入用户名' };
  }

  async setUserAvatar(user: User, file) {
    let random = Date.now() + '&';
    let writeSream = createWriteStream(
      join('public/static', random + file.originalname),
    );
    writeSream.write(file.buffer);
    let newUser = await this.userRepository.findOne({ userId: user.userId });
    newUser.avatar = `static/${random}${file.originalname}`;
    await this.userRepository.save(newUser);
    return { message: '修改头像成功', data: newUser };
  }
}
