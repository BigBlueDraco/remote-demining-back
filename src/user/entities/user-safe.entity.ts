import { ApiProperty } from '@nestjs/swagger';

export class UserSafe {
  @ApiProperty({
    description: 'User email',
    example: 'exemple@mail.com',
    type: String,
    required: true,
  })
  email: string;

  @ApiProperty({
    description: 'User mongo ID',
    example: 'mongoID',
    type: String,
    required: true,
  })
  ['_id']: string;
}
