import { ConflictException, Injectable } from '@nestjs/common';
import { SignupDto } from './dtos/signup.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
    constructor(@InjectModel(User.name) private UserModel: Model<User>) {}
    async signup(signupData: SignupDto){
        const {email, password, name } = signupData;
        const emailInUse = await this.UserModel.findOne({email})
        if (emailInUse){
            throw new ConflictException("Email already in use")
        }
        const hashedPassword = bcrypt.hash(password, 10);

        await this.UserModel.create({
            name,
            email,
            hashedPassword,
        });
    }
}
