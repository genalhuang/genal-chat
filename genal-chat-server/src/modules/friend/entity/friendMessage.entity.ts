import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class FriendMessage {
  @PrimaryGeneratedColumn()
  _id: number;

  @Column()
  userId: string;

  @Column()
  friendId: string;

  @Column()
  content: string;

  @Column()
  messageType: string;

  @Column('double')
  time: number;
}