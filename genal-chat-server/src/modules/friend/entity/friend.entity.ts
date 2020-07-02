import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Friend {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  friendId: string;

  @Column()
  userId: string;

  @Column('double')
  createTime: number;
}
