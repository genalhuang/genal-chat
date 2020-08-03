import { Injectable } from '@nestjs/common';
import { Repository, Connection, getRepository, Like } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { GroupMap } from '../group/entity/group.entity';
import { createWriteStream } from 'fs';
import { join } from 'path'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(GroupMap)
    private readonly groupUserRepository: Repository<GroupMap>,
  ) {}

  async getUser(userId: string) {
    try {
      let data;
      if(userId) {
        data = await this.userRepository.findOne({
          select: ['userId','username','avatar','role','tag','createTime'],
          where:{userId: userId}
        })
        return {code: 0, msg:'获取用户成功', data}
      }
      data = await this.userRepository.find()
      return {code: 0, msg:'获取所有用户成功', data}
    } catch(e) {
      return { code: 1 , msg:'获取用户失败', data: e}
    }
  }

  async postUsers(userIds: string) {
    try {
      if(userIds) {
        let userIdArr = userIds.split(',');
        let userArr = []
        for(let userId of userIdArr) {
          if(userId) {
            const data = await this.userRepository.findOne({
              select: ['userId','username','avatar','role','tag','createTime'],
              where:{userId: userId}
            })
            userArr.push(data)
          }
        }
        return {code: 0, msg:'获取用户信息1成功', data: userArr}
      }
      return {code: 1, msg:'获取用户信息失败', data: null}
    } catch(e) {
      return { code: 2 , msg:'获取用户信息失败', data: e}
    }
  }

  async addUser(user: User) {
    try {
      let isHave = await this.userRepository.find({username: user.username})
      if(isHave.length) {
        return {code: 1, msg:'用户名重复', data: '' }
      }

      let index = Math.round(Math.random()*19 +1)
      user.avatar = `avatar/avatar(${index}).png`

      const data = await this.userRepository.save(user)

      await this.groupUserRepository.save({
        userId: data.userId,
        groupId: 'public',
      })
      
      return {code: 0, msg:'注册成功', data }
    } catch(e) {
      return {code: 1, msg:'注册失败', data: e}
    }

  }

  async updateUser(userId: string, user: User) {
    try {
      const oldUser = await this.userRepository.findOne({userId: userId})
      console.log(userId)
      if(user.password === oldUser.password) {
        const isHaveName = await this.userRepository.findOne({username: user.username})
        if(isHaveName) {
          return {code: 1, msg:'用户名重复', data: ''}
        }
        await this.userRepository.update(oldUser,user)
        let newUser = await this.userRepository.findOne({userId: userId})
        return {code: 0, msg:'更新用户信息成功', data: newUser}
      } 
      return {code: 1, msg:'密码错误', data: ''}
    } catch(e) {
      return {code: 1, msg: '更新用户信息失败', data: e}
    }
  }

  async delUser(userId: string) {
    try {
      const data =  await this.userRepository.delete({userId: userId})
      return {code: 0, msg: '用户删除成功', data}
    } catch(e) {
      return {code: 1, msg:'用户删除失败', data: e}
    }
  }

  async login(user: {username: string, password: string}) {
    try {
      const data = await this.userRepository.findOne({username:user.username, password: user.password})
      if(!data) {
        return {code: 1 , msg:'密码错误', data: ''}
      }
      return {code: 0, msg:'登录成功', data: data}
    }catch(e) {
      return {code: 1, msg:'登录失败', data: e}
    }
  }

  async getUsersByName(username: string) {
    try {
      if(username) {
        let users = await this.userRepository.find({
          select: ['userId','username','avatar','role','tag','createTime'],
          where:{username: Like(`%${username}%`)}
        })
        return {code: 0, msg:'获取用户信息成功', data: users}
      }
      return {code: 1, msg:'请输入用户名', data: null}
    } catch(e) {
      return {code: 2, msg:'查找用户错误', data: null}
    }
  }

  async setUserAvatar(user: User, file) {
    try {
      let random = Date.now() + '&'
      let writeSream = createWriteStream(join('public/avatar', random + file.originalname))
      writeSream.write(file.buffer)
      let newUser = await this.userRepository.findOne({userId: user.userId})
      newUser.avatar = `avatar/${random}${file.originalname}`
      await this.userRepository.save(newUser)
      return {code: 0, msg: '修改头像成功', data: newUser}
    } catch (e) {
      return {code: 2, msg: '修改头像失败', data: e}
    }
  }
}
