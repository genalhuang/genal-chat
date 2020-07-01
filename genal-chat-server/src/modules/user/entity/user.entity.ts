import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  userId: string;

  @Column({ default: '陈冠希' })
  username: string;

  @Column({ default: '123456' })
  password: string;

  @Column({ default: 'chenguanxi.png' })
  avatar: string;

  @Column({ default: 'user' })
  role: string;

  @Column({ default: '' })
  tag: string;

  @Column({type: 'double'})
  createTime: number;
}
