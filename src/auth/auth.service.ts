import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { RegisterUserDto } from './dto/registerUser.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
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
}
