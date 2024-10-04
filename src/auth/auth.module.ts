
import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';

import { AuthService } from './auth.service';//auth services

import { AuthController } from './auth.controller'; // auth controller

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      secret: 'your_jwt_secret', // Use Jwt_secrect key
      signOptions: { expiresIn: '1d' }, // Token expiration time
    }),
  ],
  providers: [AuthService,JwtService],
  controllers: [AuthController],
   exports:[AuthService]
})
export class AuthModule {}
