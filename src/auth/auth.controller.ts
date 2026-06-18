import { Body, Controller, Post } from '@nestjs/common';
import { CreateOneUserDto } from '@src/users/interfaces/users.interfaces';
import { LoginDto } from './interfaces/auth.interfaces';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(registrationData: CreateOneUserDto) {}

  @Post('login')
  async login(@Body() loginData: LoginDto): Promise<{ access_token: string }> {
    return await this.authService.login(loginData);
  }
}
