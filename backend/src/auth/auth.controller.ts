import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dtos/signup.dto';
import { LoginDto } from './dtos/login.dto';
import { RefreshToken } from './schemas/refresh-token.schema';
import { RefreshTokenDto } from './dtos/refresh-tokens.dto';
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    // SIGNUP
    @Post('signup') //auth/signup
    async signUp(@Body() signupData: SignupDto){
        return this.authService.signup(signupData)
    }
    // SIGNIN
    @Post('login')
    async signIn(@Body() credentials: LoginDto){
        return this.authService.login(credentials)
    }

    // REFRESH TOKEN
    @Post('refresh')
    async refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
        return this.authService.refreshTokens(refreshTokenDto.refreshToken)
    }
}
