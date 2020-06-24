import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatDto } from './dto/chat.dto'
import { Chat } from './chat.entity'

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat) 
    private readonly chatRepository: Repository<Chat>
  ) {}

  async saveMessage(message: ChatDto) {
    return await this.chatRepository.save(message);
  }

  async getMessages() {
    return await this.chatRepository.find();
  }
}