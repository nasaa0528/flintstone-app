import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forRoot('mongodb://127.0.0.1/AuthExample'), AuthModule],
  controllers: [AuthController],
  providers: [AuthService] 
})
export class AuthModule {}
