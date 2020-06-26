import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'public' })
  group: string;

  @Column()
  name: string;

  @Column()
  message: string;
}
