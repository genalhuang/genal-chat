import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entity/message.entity';
import { User } from '../user/entity/user.entity';
import { Group } from '../group/entity/group.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message]),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Group]),
  ],
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessageModule {}
