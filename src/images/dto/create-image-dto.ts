import { IsBase64, IsNotEmpty } from 'class-validator';

export class CreateImageDto {
  blob: string;
}
