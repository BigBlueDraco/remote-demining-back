import { ApiProperty } from '@nestjs/swagger';

export class Content {
  @ApiProperty({
    description: 'Array of image id',
    example: '["imageId"]',
    type: Array,
    required: true,
  })
  images: string[];

  @ApiProperty({
    description: 'Data object',
    example: { key: 'value' },
    type: Object,
    required: true,
  })
  data: any;

  @ApiProperty({
    description: 'Data schema object',
    example: { key: 'type' },
    type: Object,
    required: true,
  })
  dataSchema: any;
  @ApiProperty({
    description: 'mongo ID',
    example: 'mongoID',
    type: String,
    required: true,
  })
  ['_id']: string;
}
