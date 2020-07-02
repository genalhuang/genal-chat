import { Injectable } from '@nestjs/common';
import { Repository, Connection, getRepository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Friend } from './entity/friend.entity';
import { FriendMessage } from './entity/friendMessage.entity';

@Injectable()
export class FriendService {
  constructor(
    @InjectRepository(Friend)
    private readonly friendRepository: Repository<Friend>,
    @InjectRepository(FriendMessage)
    private readonly friendMessageResponsity: Repository<FriendMessage>,
  ){}

  async getFriends(userId: string) {
    try {
      console.log(userId)
      if(userId) {
        return {code: 0, data: await this.friendRepository.find({userId: userId}) }
      } else {
        return {code: 0, data: await this.friendRepository.find()}
      }

    } catch(e) {
      return { code:1, data:e}
    }
  }

  async getFriendMessages(userId: string, friendId: string) {
    console.log(userId, friendId)
    try {
      let data = []
      const userMessages = await this.friendRepository.find({userId: userId, friendId: friendId });
      const friendMessages = await this.friendRepository.find({userId: friendId, friendId: userId });
      data = [...userMessages, ...friendMessages]
      console.log(data)
      return {code: 0, data: data}
    } catch(e) {
      return { code:1, data:e}
    }
  }
}
