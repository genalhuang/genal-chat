import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Friend {
  @PrimaryGeneratedColumn()
  _id: number;

  @Column()
  friendId: string;

  @Column()
  userId: string;
}
