import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entity/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service'
import { GroupMap } from '../group/entity/group.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, GroupMap]),
  ],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
