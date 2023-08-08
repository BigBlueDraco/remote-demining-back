import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNotEmptyObject, IsObject } from 'class-validator';

export class CreateContentDto {
  @ApiProperty({
    description: 'A base64 string of images',
    example: 'asdkkadkakAJIJAKFmasmdkajsdjalsjdASDLSAJLDASdalsdalsd',
    type: String,
  })
  images: string;

  @ApiProperty({
    description: 'Data object',
    example: { key: 'value' },
    type: Object,
  })
  @IsNotEmpty()
  @IsObject()
  @IsNotEmptyObject()
  data: any;

  @ApiProperty({
    description: 'Data schema object',
    example: { key: 'value' },
    type: Object,
  })
  @IsNotEmpty()
  @IsObject()
  @IsNotEmptyObject()
  dataSchema: any;
}
