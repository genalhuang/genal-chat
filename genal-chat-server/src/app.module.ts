import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupModule } from './modules/group/group.module';
import { UserModule } from './modules/user/user.module';
import { ChatModule } from './modules/chat/chat.module';

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
    GroupModule,
    UserModule,
    ChatModule
  ],
})
export class AppModule {}
