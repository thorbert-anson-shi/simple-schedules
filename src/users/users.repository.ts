import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { User } from 'src/db/types';
import { CreateOneUserDto } from './interfaces/users.interfaces';
import { usersTable } from 'src/db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class UsersRepository {
  constructor(@Inject('DB_CLIENT') private db: NodePgDatabase) {}

  async findById(userId: number): Promise<User[]> {
    return await this.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId));
  }

  async findByEmail(email: string): Promise<User[]> {
    return await this.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));
  }

  async createUser(userData: CreateOneUserDto): Promise<User> {
    return {} as User;
  }

  async deleteUser(userId: number): Promise<void> {
    return;
  }
}
