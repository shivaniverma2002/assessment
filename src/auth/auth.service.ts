// src/auth/auth.service.ts
import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';
import { RegisterDto } from './dto/register.dto'; // Ensure this DTO is correctly defined
import { LoginDto } from './dto/login.dto'; // Ensure this DTO is correctly defined

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<User> {
    const existingUser = await this.userService.findOneByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('User already exists');
    }
    return this.userService.create(registerDto); // Ensure create method accepts RegisterDto
  }

  async login(loginDto: LoginDto): Promise<{ access_token: string }> {
    const user = await this.userService.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { email: user.email , sub: user.id };
    return {
      access_token: this.jwtService.sign(payload), // Create a JWT token
    };
  }
}
