import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 登录测试
  @Post('/login')
  async login(@Body() body) {
    return this.authService.login(body);
  }

  @Post('/register')
  async register(@Body() body) {
    return this.authService.register(body);
  }
}
