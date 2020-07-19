import { Controller, Post, HttpCode, Get, Body, Query, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUsers(@Query('userId') userId: string) {
    return this.userService.getUser(userId)
  }

  @Post()
  addUser(@Body() user) {
    user.createTime = parseInt(user.createTime)
    return this.userService.addUser(user)
  }

  @Patch(':userId')
  updateUser(@Param('userId') userId, @Body() user) {
    console.log(userId, user)
    return this.userService.updateUser(userId, user)
  }

  @Delete()
  delUser(@Query() { id }) {
    return this.userService.delUser(id);
  }

  @Post('/login')
  login(@Body() user) {
    return this.userService.login(user)
  }
}
