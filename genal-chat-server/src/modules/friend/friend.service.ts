import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserMap } from './entity/friend.entity';
import { FriendMessage } from './entity/friendMessage.entity';
import { RCode } from 'src/common/constant/rcode';

@Injectable()
export class FriendService {
  constructor(
    @InjectRepository(UserMap)
    private readonly friendRepository: Repository<UserMap>,
    @InjectRepository(FriendMessage)
    private readonly friendMessageResponsity: Repository<FriendMessage>,
  ){}

  async getFriends(userId: string) {
    try {
      if(userId) {
        return { msg:'获取用户好友成功', data: await this.friendRepository.find({userId: userId}) }
      } else {
        return { msg:'获取用户好友失败', data: await this.friendRepository.find() }
      }
    } catch(e) {
      return { code:RCode.ERROR, msg:'获取用户好友失败', data:e }
    }
  }

  async getFriendMessages(userId: string, friendId: string) {
    try {
      let data = []
      const userMessages = await this.friendMessageResponsity.find({userId: userId, friendId: friendId });
      const friendMessages = await this.friendMessageResponsity.find({userId: friendId, friendId: userId });
      data = [...userMessages, ...friendMessages]
      // 得到私聊消息后先排个序
      data.sort((a:any,b:any)=>{
        return a.time - b.time;
      })
      return { data: data }
    } catch(e) {
      return { code:RCode.ERROR, msg:'获取好友消息失败', data:e }
    }
  }
}
