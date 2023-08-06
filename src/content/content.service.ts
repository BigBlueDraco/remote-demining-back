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
      console.log(createContentDto);
      const imageIDs = [];
      const { images, ...rest } = createContentDto;
      if (images) {
        const data = await this.imagesService.create({ blob: images });
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
    } catch (err) {
      throw err;
    }
  }

  async findAll() {
    try {
      const content = await this.contentModel.find();
      return content || [];
    } catch (err) {
      throw err;
    }
  }

  async findOne(id: number) {
    try {
      const content = await this.contentModel.findById(id);
      return content || [];
    } catch (err) {
      throw err;
    }
  }

  update(id: number, updateContentDto: UpdateContentDto) {
    return `This action updates a #${id} content`;
  }

  remove(id: number) {
    return `This action removes a #${id} content`;
  }
}
