import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNotEmptyObject, IsObject } from 'class-validator';

export class CreateContentDto {
  @ApiProperty({
    description: 'A base64 string of images',
    example: 'base64img | [base64img, base64img, base64img]',
    type: String || Array,
    required: false,
  })
  images: string | string[];

  @ApiProperty({
    description: 'Data object',
    example: { key: 'value' },
    type: Object,
    required: true,
  })
  @IsNotEmpty()
  @IsObject()
  @IsNotEmptyObject()
  data: any;

  @ApiProperty({
    description: 'Data schema object',
    example: { key: 'value' },
    type: Object,
    required: true,
  })
  @IsNotEmpty()
  @IsObject()
  @IsNotEmptyObject()
  dataSchema: any;
}
