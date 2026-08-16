import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  @IsNotEmpty()
  fName: string | undefined;

  @IsString()
  @IsNotEmpty()
  lName: string | undefined;

  @IsEmail()
  @IsNotEmpty()
  email: string | undefined;

  @IsString()
  @IsNotEmpty()
  password: string | undefined;
}
