import { Controller, Post, HttpCode, Get, Body, Query } from '@nestjs/common';
import { EventsGateway } from './events.gateway'

@Controller('events')
export class EventsController {
  constructor(private eventsGateway: EventsGateway) {}

}
