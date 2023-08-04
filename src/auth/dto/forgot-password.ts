import { ApiProperty } from '@nestjs/swagger';

export class forgotPasswordDto {
  @ApiProperty({
    type: String,
    description: 'User email',
    example: 'user@example.com',
  })
  email: string;
}
