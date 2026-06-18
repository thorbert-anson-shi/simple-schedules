import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from '@src/db/types';
import { CreateOneUserDto } from './interfaces/users.interfaces';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async findById(userId: number): Promise<User> {
    const foundUsers = await this.usersRepository.findById(userId);
    if (foundUsers.length === 1) {
      return foundUsers[0];
    } else if (foundUsers.length === 0) {
      throw new NotFoundException();
    } else {
      throw new InternalServerErrorException();
    }
  }

  async findByEmail(email: string): Promise<User> {
    const foundUsers = await this.usersRepository.findByEmail(email);
    if (foundUsers.length === 1) {
      return foundUsers[0];
    } else if (foundUsers.length === 0) {
      throw new NotFoundException();
    } else {
      throw new InternalServerErrorException();
    }
  }

  async createUser(userData: CreateOneUserDto): Promise<User> {
    return await this.usersRepository.createUser(userData);
  }

  async deleteUser(userId: number): Promise<void> {
    return await this.usersRepository.deleteUser(userId);
  }
}
