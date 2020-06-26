import { Controller, Post, HttpCode, Get, Body, Query } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { Chat } from './entity/chat.entity';

@Controller('chat')
export class ChatController {
  constructor(private chatGateway: ChatGateway) {}

  @Get()
  getMessages() {
    return this.chatGateway.getMessages()
  }

  @Post()
  sendMessage(@Body() message: Chat) {
    return this.chatGateway.sendMessage(message)
  }
}
