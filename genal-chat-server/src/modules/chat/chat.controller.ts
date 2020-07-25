import { Controller, Post, HttpCode, Get, Body, Query } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';

@Controller()
export class ChatController {
  constructor(private chatGateway: ChatGateway) {}
}
