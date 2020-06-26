import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { EventsController } from './events.controller';

@Module({
  providers: [EventsGateway],
  controllers: [EventsController],
})
export class EventsModule {}
