import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  account_id: number;

  @Column()
  account_activity_amount: string;

  @Column()
  account_balance: string;

  @Column()
  account_activity_details: string;

  @Column()
  account_activity_type: string;

  @Column()
  account_owner: number;

  @CreateDateColumn()
  account_activity_date: Date;
}
