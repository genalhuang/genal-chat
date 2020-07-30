import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { ChatModule } from './modules/chat/chat.module';
import { FriendModule } from './modules/friend/friend.module';
import { GroupModule } from './modules/group/group.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      // type: 'mongodb',
      // host: 'localhost',
      // port: 27017,
      type: 'mysql',
      host: '172.28.10.24',
      port: 4408,
      username: 'zhg',
      password: '123456',
      database: 'chat',
      charset: 'utf8mb4', // 设置chatset编码为utf8mb4
      autoLoadEntities: true,
      synchronize: true,
    }),
    UserModule,
    ChatModule,
    FriendModule,
    GroupModule,
  ],
})
export class AppModule {}
