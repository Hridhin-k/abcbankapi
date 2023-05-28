import { Injectable } from '@nestjs/common';
import { User } from './usersEntity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// This should be a real class/interface representing a user entity
export type user = any;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async addNewUser(data: any) {
    const newUser = await this.userRepository.create(data);
    return this.userRepository.save(newUser);
  }
  async findOne(user_email: string): Promise<User> {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.user_email = :user_email', { user_email })
      .getOne();
  }
}
