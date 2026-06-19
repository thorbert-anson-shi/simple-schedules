import { Body, Controller, Post } from '@nestjs/common';
import {
  LoginDto,
  RegistrationDto,
  RegistrationResultDto,
} from './interfaces/auth.interfaces';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(
    @Body() registrationData: RegistrationDto,
  ): Promise<RegistrationResultDto> {
    return await this.authService.register(registrationData);
  }

  @Post('login')
  async login(@Body() loginData: LoginDto): Promise<{ access_token: string }> {
    return await this.authService.login(loginData);
  }
}
