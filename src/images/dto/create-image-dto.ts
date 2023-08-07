import { IsBase64, IsNotEmpty } from 'class-validator';

export class CreateImageDto {
  @IsNotEmpty()
  @IsBase64()
  blob: string;
}
