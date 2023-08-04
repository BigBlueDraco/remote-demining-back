import { IsNotEmpty, IsString, Length } from 'class-validator';

export class PassworGroupDto {
  @IsNotEmpty()
  @IsString()
  @Length(8, 64)
  password: string;
  @IsNotEmpty()
  @IsString()
  @Length(8, 64)
  confirmPassword: string;
}
