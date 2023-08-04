import {
  IsArray,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
} from 'class-validator';

export class CreateContentDto {
  @IsArray()
  images: Blob[];
  @IsNotEmpty()
  @IsObject()
  @IsNotEmptyObject()
  data: any;
  @IsNotEmpty()
  @IsObject()
  @IsNotEmptyObject()
  dataSchema: any;
}
