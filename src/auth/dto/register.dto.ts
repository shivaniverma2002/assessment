// src/auth/dto/register.dto.ts
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  // Add other fields if needed
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  age: string; // Adjust type as necessary

  @IsString()
  address: string; // Adjust type as necessary
}
