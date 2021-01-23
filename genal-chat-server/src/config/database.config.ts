import {registerAs} from "@nestjs/config";

export default registerAs('database', () => ({
    type: process.env.DB_TYPE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    charset: 'utf8mb4',
    autoLoadEntities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true
}));
