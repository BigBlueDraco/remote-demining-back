import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class SingupDto {
  @ApiProperty({
    description: 'User email',
    example: 'user@example.com',
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
  @Length(8, 64)
  password: string;

  @ApiProperty({
    description: 'Confirm password',
    example: 'secretpassword',
    type: String,
    minLength: 8,
    maxLength: 64,
  })
  @IsNotEmpty()
  @IsString()
  @Length(8, 64)
  confirmPassword: string;
}
