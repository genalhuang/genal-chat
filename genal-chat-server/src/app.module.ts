import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { GroupModule } from './group/group.module';
import { MessageModule } from './message/message.module';

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
  ],
})
export class AppModule {}
