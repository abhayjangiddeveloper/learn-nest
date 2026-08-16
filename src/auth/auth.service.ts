import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { UserService } from 'src/user/user.service';
import { LoginUserDto } from './dto/loginUser.dto';
import { RegisterUserDto } from './dto/registerUser.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async registerUser(registerUserDto: RegisterUserDto) {
    const saltRounds = 10;
    const hasPassword = await bcrypt.hash(
      registerUserDto.password as string,
      saltRounds,
    );

    const user = await this.userService.createUser({
      ...registerUserDto,
      password: hasPassword,
    });

    const payload = { email: user.email, sub: user._id, role: user.role };
    const accessToken = await this.jwtService.signAsync(payload);

    return { user, accessToken };
  }

  async loginUser(loginUserDto: LoginUserDto) {
    const user = await this.userModel.findOne({ email: loginUserDto.email });

    if (!user) {
      throw new NotFoundException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(
      loginUserDto.password as string,
      user.password as string,
    );

    if (!isMatch) {
      throw new NotFoundException('Password is incorrect');
    }

    const payload = { email: user.email, sub: user._id, role: user.role };
    const accessToken = await this.jwtService.signAsync(payload);

    const finalUser = {
      user: {
        _id: user._id,
        fName: user.fName,
        lName: user.lName,
        email: user.email,
        role: user.role,
      },
      accessToken: accessToken,
    };

    return finalUser;
  }
}
