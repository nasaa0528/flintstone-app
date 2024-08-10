import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { RefreshToken, RefreshTokenSchema } from './schemas/refresh-token.schema';

@Module({
  imports: [MongooseModule.forFeature([
    {
      name: User.name ,
      schema: UserSchema
    },
    {
      name: RefreshToken.name,
      schema: RefreshTokenSchema
    }
  ]), AuthModule],
  controllers: [AuthController],
  providers: [AuthService] 
})
export class AuthModule {}
