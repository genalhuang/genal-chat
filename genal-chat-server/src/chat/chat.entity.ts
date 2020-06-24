import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Chat {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({default:'陈冠希'})
  user: string;

  @Column()
  message: string;
}