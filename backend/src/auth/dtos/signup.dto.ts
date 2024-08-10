import { IsEmail, IsString, Matches, MinLength } from 'class-validator';
export class SignupDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}
