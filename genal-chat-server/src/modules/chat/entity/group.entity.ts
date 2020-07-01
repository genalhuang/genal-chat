import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';

@Entity()
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  groupId: string;

  @Column()
  userId: string;

  @Column()
  groupname: string;

  @Column()
  createTime: string;
}
