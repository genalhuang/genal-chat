import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Message {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({default:'public'})
  group: string;

  @Column()
  user: string;

  @Column()
  message: string;
}
