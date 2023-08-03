import { PartialType } from '@nestjs/mapped-types';
import { SingupDto } from './singup';

export class UpdateAuthDto extends PartialType(SingupDto) {}
