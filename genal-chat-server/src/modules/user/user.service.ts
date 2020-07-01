import { Injectable } from '@nestjs/common';
import { Repository, Connection, getRepository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getUser(userId: string) {
    try {
      let data;
      if(userId) {
        data = await this.userRepository.find({userId: userId})
        return {code: 0, data}
      }
      data = await this.userRepository.find()
      return {code: 0, data}
    } catch(e) {
      return { code: 1 ,data: e}
    }
  }

  async addUser(user: User) {
    try {
      user.userId = '10'
      let data = await this.userRepository.save(user)
      return {code: 0, data }
    } catch(e) {
      return {code: 1, data: e}
    }

  }

  async updateUser(userId: string, user: User) {
    try {
      let oldUser = await this.userRepository.findOne({userId: userId})
      console.log(userId)
      if(user.password === oldUser.password) {
        let data = await this.userRepository.update(oldUser,user)
        return {code: 0,data}
      } 
      return {code: 1, data: '密码错误'}
    } catch(e) {
      return {code: 1, data: e}
    }
  }

  async delUser(userId: string) {
    try {
      let data =  await this.userRepository.delete({userId: userId})
      return {code: 0,data}
    } catch(e) {
      return {code: 1, data: e}
    }
  }

  async login(user: {username: string, password: string}) {
    try {
      let users = await this.userRepository.find({username:user.username, password: user.password})
      if(!users.length) {
        return {code: 1 , data: []}
      }
      return {code: 0, data: '登录成功'}
    }catch(e) {
      return {code: 1, data: e}
    }
  }

}
