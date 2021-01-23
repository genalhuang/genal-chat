import {registerAs} from "@nestjs/config";

export default registerAs('base', () => ({
    //加盐字符串用于密码加密
    passwordSalt: process.env.BASE_PASSWORD_SALT || 'atm'
}))
