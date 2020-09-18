import { Injectable } from '@nestjs/common';
import { Repository, Like } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Group, GroupMap } from '../group/entity/group.entity';
import { createWriteStream } from 'fs';
import { join } from 'path'
import { RCode } from 'src/common/constant/rcode';
import { GroupMessage } from '../group/entity/groupMessage.entity';
import { UserMap } from '../friend/entity/friend.entity';
import { FriendMessage } from '../friend/entity/friendMessage.entity';
import { getConnection } from "typeorm";

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
        })
        return { msg:'获取用户成功', data }
      }
    } catch(e) {
      return { code: RCode.ERROR , msg:'获取用户失败', data: e }
    }
  }

  async postUsers(userIds: string) {
    try {
      if(userIds) {
        const userIdArr = userIds.split(',');
        const userArr = []
        for(const userId of userIdArr) {
          if(userId) {
            const data = await this.userRepository.findOne({
              where:{userId: userId}
            })
            userArr.push(data)
          }
        }
        return { msg:'获取用户信息成功', data: userArr}
      }
      return {code: RCode.FAIL, msg:'获取用户信息失败', data: null }
    } catch(e) {
      return { code: RCode.ERROR , msg:'获取用户信息失败', data: e }
    }
  }

  async addUser(user: User) {
    try {
      const isHave = await this.userRepository.find({username: user.username})
      if(isHave.length) {
        return {code: 1, msg:'用户名重复', data: '' }
      }

      const index = Math.round(Math.random()*19 +1)
      user.avatar = `api/avatar/avatar(${index}).png`

      const data = await this.userRepository.save(user)

      await this.groupUserRepository.save({
        userId: data.userId,
        groupId: '阿童木聊天室',
      })
      return { msg:'注册成功', data }
    } catch(e) {
      return { code: RCode.ERROR, msg:'注册失败', data: e }
    }
  }

  async updateUserName(user: User) {
    try {
      const oldUser = await this.userRepository.findOne({userId: user.userId, password: user.password})
      if(oldUser) {
        const isHaveName = await this.userRepository.findOne({username: user.username})
        if(isHaveName) {
          return {code: 1, msg:'用户名重复', data: ''}
        }
        await this.userRepository.update(oldUser,user)
        const newUser = user;
        return { msg:'更新用户名成功', data: newUser}
      } 
      return {code: RCode.FAIL, msg:'密码错误', data: '' }
    } catch(e) {
      return {code: RCode.ERROR, msg: '更新用户名失败', data: e }
    }
  }

  async updatePassword(user: User, password: string) {
    try {
      const oldUser = await this.userRepository.findOne({userId: user.userId, username: user.username, password: user.password})
      if(oldUser) {
        const newUser = JSON.parse(JSON.stringify(oldUser))
        newUser.password = password;
        await this.userRepository.update(oldUser, newUser)
        return { msg:'更新用户密码成功', data: newUser}
      } 
      return {code: RCode.FAIL, msg:'密码错误', data: '' }
    } catch(e) {
      return {code: RCode.ERROR, msg: '更新用户密码失败', data: e }
    }
  }

  async jurisdiction(userId: string) {
    const user = await this.userRepository.findOne({userId: userId})
    const newUser = JSON.parse(JSON.stringify(user))
    if(user.username === '陈冠希') {
      newUser.role = 'admin';
      await this.userRepository.update(user,newUser)
      return { msg:'更新用户信息成功', data: newUser}
    }
  }

  async delUser(uid: string, psw: string, did: string) {
    try {
      const user = await this.userRepository.findOne({userId: uid})
      if(user.role === 'admin') {
        if(user.password === psw) {
          await getConnection()
            .createQueryBuilder()
            .delete()
            .from(User)
            .where("userId = :id", { id: did })
            .execute();
          await getConnection()
            .createQueryBuilder()
            .delete()
            .from(Group)
            .where("userId = :id", { id: did })
            .execute();
          await getConnection()
            .createQueryBuilder()
            .delete()
            .from(GroupMap)
            .where("userId = :id", { id: did })
            .execute();
          await getConnection()
            .createQueryBuilder()
            .delete()
            .from(GroupMessage)
            .where("userId = :id", { id: did })
            .execute();
          await getConnection()
            .createQueryBuilder()
            .delete()
            .from(UserMap)
            .where("userId = :id", { id: did })
            .execute();
          await getConnection()
            .createQueryBuilder()
            .delete()
            .from(UserMap)
            .where("friendId = :id", { id: did })
            .execute();
          await getConnection()
            .createQueryBuilder()
            .delete()
            .from(FriendMessage)
            .where("userId = :id", { id: did })
            .execute();
          await getConnection()
            .createQueryBuilder()
            .delete()
            .from(FriendMessage)
            .where("friendId = :id", { id: did })
            .execute();
          return { msg: '用户删除成功'}
        }
      }
      return {code: RCode.FAIL, msg:'用户删除失败'}
    } catch(e) {
      return {code: RCode.ERROR, msg:'用户删除失败', data: e}
    }
  }

  async getUsersByName(username: string) {
    try {
      if(username) {
        const users = await this.userRepository.find({
          where:{username: Like(`%${username}%`)}
        });
        return { data: users }
      }
      return {code: RCode.FAIL, msg:'请输入用户名', data: null}
    } catch(e) {
      return {code: RCode.ERROR, msg:'查找用户错误', data: null}
    }
  }

  async setUserAvatar(user: User, file) {
    try {
      const random = Date.now() + '&'
      const writeSream = createWriteStream(join('public/avatar', random + file.originalname))
      writeSream.write(file.buffer)
      const newUser = await this.userRepository.findOne({userId: user.userId, password: user.password})
      newUser.avatar = `api/avatar/${random}${file.originalname}`
      newUser.password = user.password;
      await this.userRepository.save(newUser)
      return { msg: '修改头像成功', data: newUser}
    } catch (e) {
      return {code: RCode.ERROR, msg: '修改头像失败', data: e}
    }
  }
}
