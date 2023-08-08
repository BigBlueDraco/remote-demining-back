import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ImagesService } from 'src/images/images.service';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { Content } from './schemas/content.schema';
import { ContentFilterDto } from './dto/content-filter.dto';

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
        const data = await this.imagesService.create({ blob: images });
        if (!data) {
          throw data;
        }
        imageIDs.push(data.id);
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
  createFilter(obj: object) {
    const filter = {};
    let obj1;
    for (const key in obj) {
      if (typeof obj[key] === 'object') {
        obj1 = this.createFilter(obj[`${key}`]);
        for (const key1 in obj1) {
          filter[key + '.' + key1] = obj1[key1];
        }
      } else {
        filter[key] = obj[key];
      }
    }
    return filter;
  }
  async findAll(body: ContentFilterDto) {
    try {
      const filter = this.createFilter(body);

      const content = await this.contentModel.find(filter);

      return content || [];
    } catch (err) {
      throw err;
    }
  }

  async findOne(id: string) {
    try {
      const content = await this.contentModel.findById(id);
      if (!content) {
        throw new NotFoundException(`Content with ${id} not found`);
      }
      return content;
    } catch (err) {
      throw err;
    }
  }

  async update(id: string, updateContentDto: UpdateContentDto) {
    try {
      const { images, ...rest } = updateContentDto;
      const imageIDs = [];
      let updateData: any = { ...rest };

      const content = await this.findOne(id);

      if (!content) {
        throw new NotFoundException(`Content with id: ${id} not found`);
      }

      if (images) {
        if (content.images[0]) {
          const { id: imgId } = await this.imagesService.update(
            content.images[0],
            {
              blob: images,
            },
          );
          imageIDs.push(imgId);
        } else {
          const data = await this.imagesService.create({ blob: images });
          if (!data) {
            throw data;
          }
          imageIDs.push(data.id);
        }
      }

      if (imageIDs.length) {
        updateData = { images: [...imageIDs], ...rest };
      }
      const updatedContent = await this.contentModel.findByIdAndUpdate(
        id,
        updateData,
        { new: true },
      );
      return updatedContent;
    } catch (err) {
      throw err;
    }
  }

  async remove(id: string) {
    try {
      const content = await this.findOne(id);
      if (content.images.length) {
        console.log(content.images[0]);
        await this.imagesService.remove(content.images[0]);
      }
      await content.deleteOne({ id });
      return content;
    } catch (err) {
      throw err;
    }
  }
}
