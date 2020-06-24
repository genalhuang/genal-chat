import { Controller, Get, Post, Body } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatDto } from './dto/chat.dto'

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  getMessage() {
    return this.chatService.getMessages()
  }

  @Post()
  postMessage(@Body() message: ChatDto) {
    return this.chatService.saveMessage(message)
  }
}
