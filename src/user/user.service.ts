import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RegisterUserDto } from 'src/auth/dto/registerUser.dto';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(registerUserDto: RegisterUserDto) {
    try {
      const createdUser = await this.userModel.create(registerUserDto);
      return createdUser.toObject();
    } catch (error: unknown) {
      const err = error as {
        index: number;
        code: 11000;
        keyValue: Record<string, string>;
      };

      const DUPLICATE_KEY_ERROR_CODE = 11000;

      if (err.code === DUPLICATE_KEY_ERROR_CODE) {
        const duplicateField = Object.keys(err.keyValue)[0];
        const duplicateValue = Object.values(err.keyValue)[0];

        throw new ConflictException(
          `This ${duplicateField} ${duplicateValue} is already taken`,
        );
      } else {
        throw new Error('An error occurred while creating the user', {
          cause: error,
        });
      }
    }
  }
}
