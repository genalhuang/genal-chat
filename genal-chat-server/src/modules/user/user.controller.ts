import { Controller, Post, HttpCode, Get, Body, Query } from '@nestjs/common';
import { UserGateway } from './user.gateway';
import { UserDto } from './dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private userGateway: UserGateway) {}

  @Get()
  getUsers() {
    return this.userGateway.getUsers()
  }

  @Post()
  addUser(@Body() user: UserDto) {
    return this.userGateway.addUser(user)
  }
}
