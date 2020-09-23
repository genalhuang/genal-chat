import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entity/user.entity';
import { GroupMap } from '../group/entity/group.entity'; 

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(GroupMap)
    private readonly groupUserRepository: Repository<GroupMap>,
    private readonly jwtService: JwtService,
  ) {}

  async login(user: User): Promise<any> {
    const payload = {username: user.username, password: user.password};
    const data = await this.userRepository.findOne({username:user.username, password: user.password});
    if(!data) {
      return {code: 1 , msg:'密码错误', data: ''};
    }
    data.password = user.password;

    return {
      msg:'登录成功',
      data: {
        user: data,
        token: this.jwtService.sign(payload)
      },
    };
  }

  async regist(user: User): Promise<any> {
    const isHave = await this.userRepository.find({username: user.username});
    if(isHave.length) {
      return {code: 1, msg:'用户名重复', data: '' };
    }
    user.avatar = `api/avatar/avatar(${Math.round(Math.random()*19 +1)}).png`;
    const newUser = await this.userRepository.save(user);
    const payload = {username: newUser.username, password: newUser.password};
    await this.groupUserRepository.save({
      userId: newUser.userId,
      groupId: '阿童木聊天室',
    });
    return {
      msg:'注册成功',
      data: { 
        user: newUser,
        token: this.jwtService.sign(payload)
      },
    };
  }
}
