import { Controller, Post, Body, Get } from '@nestjs/common';
import { UserService } from './user.service'
import { UserDto } from './dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUsers() {
    return this.userService.getUsers();
  }

  @Post() 
  addUser(@Body() user: UserDto) {
    return this.userService.addUser(user)
  }

  @Post() 
  editUser(@Body() user: UserDto) {
    return this.userService.editUser(user)
  }
}
