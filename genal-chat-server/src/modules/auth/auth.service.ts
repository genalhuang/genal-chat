import {Injectable} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {User} from '../user/entity/user.entity';
import {GroupMap} from '../group/entity/group.entity';
import {md5, nameVerify, passwordVerify} from 'src/common/tool/utils';
import {RCode} from 'src/common/constant/rcode';
import {ConfigService} from "@nestjs/config";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(GroupMap)
        private readonly groupUserRepository: Repository<GroupMap>,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) {
    }

    async login(data: User): Promise<any> {
        let password = this.hash(data.password)
        const user = await this.userRepository.findOne({username: data.username, password});
        if (!user) {
            return {code: RCode.FAIL, msg: '密码错误', data: ''};
        }
        if (!passwordVerify(data.password) || !nameVerify(data.username)) {
            return {code: RCode.FAIL, msg: '注册校验不通过！', data: ''};
        }
        const payload = {userId: user.userId};
        let token = this.jwtService.sign(payload)
        return {
            msg: '登录成功',
            data: {
                user: {...user, token},
                token: token
            },
        };
    }

    async register(user: User): Promise<any> {
        const isHave = await this.userRepository.find({username: user.username});
        if (isHave.length) {
            return {code: RCode.FAIL, msg: '用户名重复', data: ''};
        }
        if (!passwordVerify(user.password) || !nameVerify(user.username)) {
            return {code: RCode.FAIL, msg: '注册校验不通过！', data: ''};
        }
        user.avatar = `api/avatar/avatar(${Math.round(Math.random() * 19 + 1)}).png`;
        user.role = 'user';
        user.password = this.hash(user.password)
        const newUser = await this.userRepository.save(user);
        const payload = {userId: newUser.userId};
        await this.groupUserRepository.save({
            userId: newUser.userId,
            groupId: 1,
        });
        return {
            msg: '注册成功',
            data: {
                user: newUser,
                token: this.jwtService.sign(payload)
            },
        };
    }

    hash(password: string) {
        return md5(this.configService.get<String>('base.passwordSalt') + password)
    }
}
