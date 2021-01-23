import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Group {
  @PrimaryGeneratedColumn()
  groupId: number;

  @Column()
  userId: number;

  @Column()
  groupName: string;

  @Column({ default: '群主很懒,没写公告' })
  notice: string;

  @Column({type: 'double',default: new Date().valueOf()})
  createTime: number;
}

@Entity()
export class GroupMap {
  @PrimaryGeneratedColumn()
  _id: number;

  @Column()
  groupId: number;

  @Column()
  userId: number;
}

