import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { Content } from './schemas/content.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ImagesService } from 'src/images/images.service';

@Injectable()
export class ContentService {
  constructor(
    @InjectModel('Content') private readonly contentModel: Model<Content>,
    private readonly imagesService: ImagesService,
  ) {}
  async create(createContentDto: CreateContentDto) {
    try {
      const imageIDs = [];
      const { images, ...rest } = createContentDto;
      if (images) {
        const data = await this.imagesService.create({ blob: images[0] });
        if (!data) {
          throw data;
        }
        imageIDs.push(data.id);
        console.log(imageIDs);
      }
      const content = new this.contentModel({
        images: [...imageIDs],
        ...rest,
      });
      const result = await content.save();
      return result;
    } catch (e) {
      throw e;
    }
  }

  findAll() {
    return `This action returns all content`;
  }

  findOne(id: number) {
    return `This action returns a #${id} content`;
  }

  update(id: number, updateContentDto: UpdateContentDto) {
    return `This action updates a #${id} content`;
  }

  remove(id: number) {
    return `This action removes a #${id} content`;
  }
}
