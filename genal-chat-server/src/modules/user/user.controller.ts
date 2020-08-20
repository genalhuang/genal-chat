import { Controller, Post, HttpCode, Get, 
  Body, Query, Patch, Param, Delete, UseInterceptors,
  UploadedFile, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  getUsers(@Query('userId') userId: string) {
    return this.userService.getUser(userId)
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  postUsers(@Body('userIds') userIds: string) {
    return this.userService.postUsers(userIds)
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':userId')
  updateUser(@Param('userId') userId, @Body() user) {
    console.log(userId, user)
    return this.userService.updateUser(userId, user)
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('/jurisdiction/:userId')
  jurisdiction(@Param('userId') userId) {
    return this.userService.jurisdiction(userId)
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete()
  delUser(@Query() { uid, psw, did }) {
    return this.userService.delUser(uid, psw, did);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/findByName')
  getUsersByName(@Query('username') username: string) {
    return this.userService.getUsersByName(username)
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  setUserAvatar(@Body() user, @UploadedFile() file) {
    return this.userService.setUserAvatar(user, file)
  }

}
