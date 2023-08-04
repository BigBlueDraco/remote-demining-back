import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class SingupDto {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  @IsString()
  @Length(8, 64)
  password: string;
  @IsNotEmpty()
  @IsString()
  @Length(8, 64)
  confirmPassword: string;
}
