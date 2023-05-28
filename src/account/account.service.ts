import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from './accountEntity';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
  ) {}

  async fetchAccountData(data: { userId: number }): Promise<Account> | null {
    try {
      const account = this.accountRepository
        .createQueryBuilder('account')
        .orderBy('account.account_activity_date', 'DESC')
        .where('account.account_owner = :userId', {
          userId: data.userId,
        })
        .getOne();

      if (!account) {
        console.error('Account not found');
        return null; // Return null or any other default value indicating no account found
      }

      return account;
    } catch (error) {
      console.error('Error retrieving account:', error);
      return null; // Return null or any other default value indicating an error occurred
    }
  }

  depositMoney(data): Promise<Account[]> {
    const newDeposit = this.accountRepository.create(data);
    return this.accountRepository.save(newDeposit);
  }

  withdrawMoney(data): Promise<Account[]> {
    const newWithdraw = this.accountRepository.create(data);
    return this.accountRepository.save(newWithdraw);
  }

  transferMoney(data): Promise<Account[]> {
    const newTransfer = this.accountRepository.create(data);
    return this.accountRepository.save(newTransfer);
  }

  async fetchUserStatement(data: { userId: number }): Promise<Account[]> {
    return this.accountRepository
      .createQueryBuilder('account')
      .orderBy('account.account_activity_date', 'DESC')
      .where('account.account_owner = :userId', {
        userId: data.userId,
      })
      .getMany();
  }
}
