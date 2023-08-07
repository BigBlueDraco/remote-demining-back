import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBase64,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
} from 'class-validator';

export class CreateContentDto {
  @ApiProperty({
    description: 'An array of images as Blob objects',
    example: new Blob(),
    type: Blob,
  })
  @IsBase64()
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
