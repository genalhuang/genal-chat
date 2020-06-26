import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { GroupModule } from './modules/group/group.module';
import { MessageModule } from './modules/message/message.module';
import { EventsModule } from './modules/events/events.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      // type: 'mongodb',
      // host: 'localhost',
      // port: 27017,
      type: 'mysql',
      port: 3306,
      username: 'root',
      password: '123456',
      database: 'chat',
      autoLoadEntities: true,
      synchronize: true,
    }),
    UserModule,
    GroupModule,
    MessageModule,
    EventsModule
  ],
})
export class AppModule {}
