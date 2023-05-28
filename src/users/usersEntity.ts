import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column({ unique: true })
  user_name: string;

  @Column({ unique: true })
  user_email: string;

  @Column()
  user_password: string;

  @Column({ default: 1 })
  user_isActive: number;

  @CreateDateColumn()
  user_createdAt: Date;
}
