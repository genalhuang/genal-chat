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

  getUser(userId: string) {
    if(userId) {
      return this.userRepository.find({userId: userId})
    }
    return this.userRepository.find()
  }

  addUser(user: User) {
    return this.userRepository.save(user)
  }

  async updateUser(userId: string, user: User) {
    let oldUser = await this.userRepository.findOne({userId: userId})
    return this.userRepository.update(oldUser,user)
  }

  delUser(userId: string) {
    return this.userRepository.delete({userId: userId})
  }
}
