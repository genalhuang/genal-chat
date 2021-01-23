import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class GroupMessage {
  @PrimaryGeneratedColumn()
  _id: number;

  @Column()
  userId: number;

  @Column()
  groupId: number;

  @Column()
  content: string;

  @Column()
  messageType: string;

  @Column('double')
  time: number;
}
