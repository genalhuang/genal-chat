import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entity/message.entity';
import { MessageDto } from './dto/message.dto';
import { Repository } from 'typeorm';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>
  ) {}

  getMessages() {
    return this.messageRepository.find()
  }

  getMessage(group: string) {
    return this.messageRepository.find({group: group})
  }

  sendMessage(message: MessageDto) {
    return this.messageRepository.save(message)
  }
}
