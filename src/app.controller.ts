import { Controller, Request, Post, UseGuards, Body } from '@nestjs/common';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { User } from './users/usersEntity';
import { UsersService } from './users/users.service';

@Controller()
export class AppController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('/register')
  newUser(
    @Body()
    userData: {
      userName: 'string';
      userEmail: 'string';
      userPassword: 'string';
    },
  ): Promise<User[]> {
    return this.userService.addNewUser({
      user_name: userData.userName,
      user_email: userData.userEmail,
      user_password: userData.userPassword,
      user_isActive: 1,
    });
  }
}
