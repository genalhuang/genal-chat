import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { MessageDto } from './dto/message.dto';
import { MessageService } from './message.service';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get()
  getMessages() {
    return this.messageService.getMessages();
  }

  @Get(':group')
  getMessage(@Param('group') group: string) {
    console.log(group);
    return this.messageService.getMessage(group);
  }

  @Post()
  sendMessage(@Body() message: MessageDto) {
    return this.messageService.sendMessage(message);
  }
}
