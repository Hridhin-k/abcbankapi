import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { Account } from './accountEntity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/usersEntity';

@Module({
  imports: [TypeOrmModule.forFeature([Account, User])],
  controllers: [AccountController],
  providers: [AccountService, JwtService, UsersService],
})
export class AccountModule {}
