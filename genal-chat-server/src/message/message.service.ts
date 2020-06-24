import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entity/message.entity';
import { MessageDto } from './dto/message.dto';
import { Repository } from 'typeorm';
import { User } from '../user/entity/user.entity';
import { Group } from '../group/entity/group.entity';

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
    const groups = await this.groupRepository.find({group: message.group})
    const users = await this.userRepository.find({user: message.user})
    if(!groups.length) {
      return '你这个群我没见过, 兄弟'
    }
    if(!users.length) {
      return '你这个用户我没见过,兄弟'
    }
    return this.messageRepository.save(message);
  }
}
