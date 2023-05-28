import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/jwt-auth.guard';
import { AccountService } from './account.service';
import { Account } from './accountEntity';
import { UsersService } from 'src/users/users.service';

@Controller('user')
export class AccountController {
  constructor(
    private readonly accountService: AccountService,
    private readonly userService: UsersService,
  ) {}
  @UseGuards(AuthGuard)
  @Get('/home')
  async getDetails(@Request() req, @Query('userId') userId: number) {
    const accountData = await this.accountService.fetchAccountData({
      userId: userId,
    });
    if (accountData) {
      return accountData;
    } else {
      return [];
    }
  }

  @UseGuards(AuthGuard)
  @Post('/deposit')
  async depositMoneyInAccount(
    @Request() req,
    @Query('userId') userId: number,
    @Body() depositAmount,
  ): Promise<Account[]> {
    const accountData = await this.accountService.fetchAccountData({
      userId: userId,
    });
    const depositedAmount = depositAmount.amount; //this is the amount the used deposits in his account
    if (accountData) {
      return this.accountService.depositMoney({
        account_activity_amount: depositedAmount,
        account_balance:
          parseInt(accountData.account_balance) + parseInt(depositedAmount),
        account_activity_details: 'deposit',
        account_activity_type: 'credit',
        account_owner: userId,
      });
    } else {
      return this.accountService.depositMoney({
        account_activity_amount: depositedAmount,
        account_balance: parseInt(depositedAmount),
        account_activity_details: 'deposit',
        account_activity_type: 'credit',
        account_owner: userId,
      });
    }
  }

  @UseGuards(AuthGuard)
  @Post('/withdraw')
  async withdrawMoneyFromAccount(
    @Request() req,
    @Query('userId') userId: number,
    @Body() data,
  ): Promise<Account[]> {
    const accountData = await this.accountService.fetchAccountData({
      userId: userId,
    });
    const withdrawedAmount = data.withdrawedAmount; //this is the amount the used withdraw from his account
    return this.accountService.withdrawMoney({
      account_activity_amount: withdrawedAmount,
      account_balance:
        parseInt(accountData.account_balance) - parseInt(withdrawedAmount),
      account_activity_details: 'withdraw',
      account_activity_type: 'debit',
      account_owner: userId,
    });
  }

  @UseGuards(AuthGuard)
  @Post('/transfer')
  async transferMoneyFromAccount(
    @Request() req,
    @Query('userId') userId: number,
    @Body() data,
  ): Promise<Account[]> {
    const accountData = await this.accountService.fetchAccountData({
      userId: userId,
    });

    const transferedAmount = data.transferedAmount; //this is the amount the user transfers to an account

    this.accountService.transferMoney({
      //return
      account_activity_amount: transferedAmount,
      account_balance:
        parseInt(accountData.account_balance) - parseInt(transferedAmount),
      account_activity_details: 'Transfered to ' + data.transferEmail,
      account_activity_type: 'debit',
      account_owner: userId,
    });
    /////////////////////////////////////////////////////////
    const user_email: string = data.transferEmail;
    const checkUser = await this.userService.findOne(user_email);
    if (checkUser) {
      const userId = checkUser.user_id;
      const accountData = await this.accountService.fetchAccountData({
        userId: userId,
      });
      if (accountData) {
        return this.accountService.transferMoney({
          account_activity_amount: transferedAmount,
          account_balance:
            parseInt(accountData.account_balance) + parseInt(transferedAmount),
          account_activity_details: 'Transfered from ' + req.user.username,
          account_activity_type: 'credit',
          account_owner: userId,
        });
      } else {
        return this.accountService.transferMoney({
          account_activity_amount: transferedAmount,
          account_balance: parseInt(transferedAmount),
          account_activity_details: 'Transfered from ' + req.user.username,
          account_activity_type: 'credit',
          account_owner: userId,
        });
      }
    }
  }

  @UseGuards(AuthGuard)
  @Get('/statement')
  async getStatement(@Request() req, @Query('userId') userId: number) {
    const statementData = await this.accountService.fetchUserStatement({
      userId: userId,
    });

    return req.user, statementData;
  }
}
