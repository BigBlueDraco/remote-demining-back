import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordParams {
  @ApiProperty({
    description: 'User ID',
    example: 'user123',
    type: String,
  })
  id: string;

  @ApiProperty({
    description: 'Password reset token',
    example: 'abcd1234',
    type: String,
  })
  token: string;
}
