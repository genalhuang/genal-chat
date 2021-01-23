import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {UserModule} from './modules/user/user.module';
import {ChatModule} from './modules/chat/chat.module';
import {FriendModule} from './modules/friend/friend.module';
import {GroupModule} from './modules/group/group.module';
import {AuthModule} from './modules/auth/auth.module';
import {ConfigModule, ConfigService} from "@nestjs/config";
import appConfig from "./config";


@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: ['.env.local', '.env'],
            load: appConfig,
            isGlobal: true
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (config: ConfigService) => {
                return config.get('database')
            },
            inject: [ConfigService],
        }),
        UserModule,
        ChatModule,
        FriendModule,
        GroupModule,
        AuthModule
    ],
})
export class AppModule {
}
