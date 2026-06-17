import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

class CreateOneUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsStrongPassword({ minLength: 8 })
  password: string;
}

export { CreateOneUserDto };
