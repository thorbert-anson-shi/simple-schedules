import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersRepository } from '@src/users/users.repository';
import {
  LoginDto,
  RegistrationDto,
  RegistrationResultDto,
} from './interfaces/auth.interfaces';
import argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { CreateOneUserDto } from '@src/users/interfaces/users.interfaces';

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async register(
    registrationData: RegistrationDto,
  ): Promise<RegistrationResultDto> {
    const passwordHash = await argon2.hash(registrationData.password);
    const userCreationData: CreateOneUserDto = {
      email: registrationData.email,
      passwordHash,
    };

    const createdUsers =
      await this.usersRepository.createUser(userCreationData);

    if (createdUsers.length === 0 || createdUsers.length > 1) {
      throw new InternalServerErrorException();
    }

    const { id, email, role } = createdUsers[0];

    return { id, email, role };
  }

  async login(loginData: LoginDto): Promise<{ access_token: string }> {
    const foundUsers = await this.usersRepository.findByEmail(loginData.email);

    if (foundUsers.length === 0) {
      throw new NotFoundException();
    } else if (foundUsers.length > 1) {
      throw new InternalServerErrorException();
    }

    const user = foundUsers[0];

    const valid = await argon2.verify(user.password_hash, loginData.password);

    if (!valid) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.id, role: user.role };

    return { access_token: await this.jwtService.signAsync(payload) };
  }
}
