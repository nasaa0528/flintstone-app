import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dtos/signup.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    // SIGNUP
    @Post('signup') //auth/signup
    async signUp(@Body() signupData: SignupDto){

    }
    // SIGNIN

    // REFRESH TOKEN
}
