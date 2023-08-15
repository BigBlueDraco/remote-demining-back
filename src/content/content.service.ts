import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isEmpty } from 'lodash';
import { Model } from 'mongoose';
import { ImagesService } from 'src/images/images.service';
import { ContentFilterDto } from './dto/content-filter.dto';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { Content } from './schemas/content.schema';

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
  /*TO DO  
Додати кешування
*/
  filter(filter, obj) {
    let res = false;
    for (const key in filter) {
      if (typeof filter[key] === 'object') {
        if (typeof obj[key] !== 'object') {
          return false;
        }
        return (res = this.filter(filter[key], obj[key]));
      }
      return (res = filter[key] === obj[key]);
    }
    return res;
  }
  async findAll(query: ContentFilterDto) {
    try {
      const filter: any = {};
      query.dataSchema
        ? (filter.dataSchema = await JSON.parse(query.dataSchema))
        : '';
      query.data ? (filter.data = await JSON.parse(query.data)) : '';
      const content = await this.contentModel.find();
      const res = !isEmpty(filter)
        ? content.filter((elem) => {
            return this.filter(filter, elem);
          })
        : content;
      return res || [];
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
