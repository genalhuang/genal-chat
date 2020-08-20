import { Controller, Post, HttpCode, Get, 
  Body, Query, Patch, Param, Delete, UseInterceptors,
  UploadedFile, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUsers(@Query('userId') userId: string) {
    return this.userService.getUser(userId)
  }

  @Post()
  postUsers(@Body('userIds') userIds: string) {
    return this.userService.postUsers(userIds)
  }

  @Patch(':userId')
  updateUser(@Param('userId') userId, @Body() user) {
    console.log(userId, user)
    return this.userService.updateUser(userId, user)
  }

  @Patch('/jurisdiction/:userId')
  jurisdiction(@Param('userId') userId) {
    return this.userService.jurisdiction(userId)
  }

  @Delete()
  delUser(@Query() { uid, psw, did }) {
    return this.userService.delUser(uid, psw, did);
  }

  @Get('/findByName')
  getUsersByName(@Query('username') username: string) {
    return this.userService.getUsersByName(username)
  }

  @Post('/avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  setUserAvatar(@Body() user, @UploadedFile() file) {
    return this.userService.setUserAvatar(user, file)
  }

}
