import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { User } from '@src/db/types';
import { CreateOneUserDto } from './interfaces/users.interfaces';
import { usersTable } from '@src/db/schema';
import { eq } from 'drizzle-orm';
import { getPostgresError } from '@src/db/utils';

@Injectable()
export class UsersRepository {
  constructor(@Inject('DB_CLIENT') private db: NodePgDatabase) {}

  async findById(userId: number): Promise<User[]> {
    try {
      return await this.db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, userId));
    } catch (error) {
      throw getPostgresError(error);
    }
  }

  async findByEmail(email: string): Promise<User[]> {
    try {
      return await this.db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, email));
    } catch (error) {
      throw getPostgresError(error);
    }
  }

  async createUser(userData: CreateOneUserDto): Promise<User[]> {
    try {
      return await this.db
        .insert(usersTable)
        .values({
          email: userData.email,
          password_hash: userData.passwordHash,
          role: 'CUSTOMER',
        })
        .returning();
    } catch (error) {
      throw getPostgresError(error);
    }
  }

  async deleteUser(userId: number): Promise<void> {
    try {
      await this.db.delete(usersTable).where(eq(usersTable.id, userId));
    } catch (error) {
      throw getPostgresError(error);
    }
  }
}
