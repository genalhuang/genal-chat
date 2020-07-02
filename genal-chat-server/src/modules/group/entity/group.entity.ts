import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Group {
  @PrimaryGeneratedColumn('uuid')
  groupId: string;

  @Column()
  userId: string;

  @Column()
  groupname: string;

  @Column('double')
  createTime: number;
}
