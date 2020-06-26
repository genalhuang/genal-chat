import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from '../chat/entity/chat.entity';
import { User } from '../user/entity/user.entity';
import { Group } from '../group/entity/group.entity';
import { UserGateway } from './user.gateway';
import { UserController } from './user.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Chat]),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Group]),
  ],
  providers: [UserGateway],
  controllers: [UserController],
})
export class UserModule {}
