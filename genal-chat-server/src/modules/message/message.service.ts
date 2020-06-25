import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entity/message.entity';
import { MessageDto } from './dto/message.dto';
import { Repository } from 'typeorm';
import { User } from '../user/entity/user.entity';
import { Group } from '../group/entity/group.entity';
import { HttpExceptionFilter } from '../../common/filters/http-exception.filter';


@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
  ) {} 

  getMessages() {
    return this.messageRepository.find();
  }

  async getMessage(group: string) {
    const groups = await this.groupRepository.find({group: group})
    if(!groups.length) {
      return '你这个群我没见过, 兄弟'
    }
    return this.messageRepository.find({ group: group });
  }

  async sendMessage(message: MessageDto) {
    const userInGroup = await this.groupRepository.find({group: message.group,user: message.user})
    if(userInGroup.length !== 0) {
      return this.messageRepository.save(message)
    }
    return "兄弟你不在这个群"
  }
}
