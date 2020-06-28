import { Controller, Post, HttpCode, Get, Body, Query } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { Chat } from './entity/chat.entity';
import { ChatDto } from './dto/chat.dto';

@Controller('chat')
export class ChatController {
  constructor(private chatGateway: ChatGateway) {}

  @Get()
  getMessages(@Query('group') group: string): Promise<Chat[]> {
    return this.chatGateway.getMessages(group)
  }

}
