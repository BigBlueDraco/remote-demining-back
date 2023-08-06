import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateImageDto } from './dto/create-image-dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Image } from './schema/image.schema';
import { error } from 'console';

@Injectable()
export class ImagesService {
  constructor(
    @InjectModel('Image') private readonly imageModel: Model<Image>,
  ) {}
  checkBlobTypes(image: CreateImageDto) {
    try {
      const typeChecks = [
        { type: 'data:', message: ' "data:" expected' },
        { type: 'image/png;', message: 'image/png; expected' },
        { type: 'image/jpeg;', message: 'image/jpeg; expected' },
        { type: 'base64,', message: '"base64," expected' },
      ];

      const typeErrors = typeChecks
        .filter((check) => !image.blob.includes(check.type))
        .map((check) => check.message)
        .join('; ');

      if (typeErrors) {
        throw new BadRequestException(
          `${typeErrors}` + 'Expect: data:image/png;base64,<BLOB>',
        );
      }
    } catch (e) {
      throw e;
    }
  }
  async create(image: CreateImageDto) {
    try {
      this.checkBlobTypes(image);
      const newImage = new this.imageModel({
        ...image,
      });
      const result = await newImage.save();
      return result;
    } catch (e) {
      throw e;
    }
  }
  async findOne(id: string) {
    try {
      const image = await this.imageModel.findById(id);
      return image;
    } catch (e) {
      throw new InternalServerErrorException(`${e}`);
    }
  }
  async delete(id: string) {
    try {
      const image = await this.imageModel.findById(id);
      await image.deleteOne({ id });
      return image;
    } catch (e) {
      throw new InternalServerErrorException(`${e}`);
    }
  }
}
