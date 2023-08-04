import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'User email',
    example: 'example@mail.com',
    type: String,
  })
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;
  @ApiProperty({
    description: 'User password',
    example: 'secretpassword',
    type: String,
    minLength: 8,
    maxLength: 64,
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
