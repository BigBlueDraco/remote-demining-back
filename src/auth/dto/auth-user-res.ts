import { ApiProperty } from '@nestjs/swagger';

export class AuthUserRes {
  @ApiProperty({
    description: 'JWT token',
    example: 'JWT',
    type: String,
  })
  access_token: string;
  @ApiProperty({
    description: 'User information',
    type: Object,
    properties: {
      email: {
        description: 'User email',
        example: 'user@example.com',
      },
    },
  })
  user: {
    email: string;
  };
}
