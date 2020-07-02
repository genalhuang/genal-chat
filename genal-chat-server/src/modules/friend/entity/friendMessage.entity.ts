import { Entity, Column, PrimaryGeneratedColumn, Double } from 'typeorm';

@Entity()
export class FriendMessage {
  @PrimaryGeneratedColumn()
  _id: number;

  @Column()
  from: string;

  @Column()
  to: string;

  @Column()
  content: string;

  @Column('double')
  time: number;
}