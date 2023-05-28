import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(user_email: string, user_password: string): Promise<any> {
    const user = await this.usersService.findOne(user_email);
    if (user && user.user_password === user_password) {
      const { user_password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const username = user.user_email;
    const userId = user.user_id;
    const payload = { username: username, sub: userId };
    return {
      access_token: this.jwtService.sign(payload),
      user_name: user.user_name,
      user_email: user.user_email,
      user_id: user.user_id,
    };
  }
}
