import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Group {
  @PrimaryGeneratedColumn("uuid")
  groupId: string;

  @Column()
  userId: string;

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
  groupId: string;

  @Column()
  userId: string;
}

