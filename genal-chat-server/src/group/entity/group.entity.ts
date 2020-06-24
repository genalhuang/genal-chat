import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'public' })
  group: string;

  @Column({ default: 'public' })
  user: string;
}
