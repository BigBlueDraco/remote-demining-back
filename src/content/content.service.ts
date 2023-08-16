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
  async createAndGetImagesId(images: string | string[]) {
    const imageIDs: string[] = [];
    if (!images) return [...imageIDs];
    if (typeof images === 'string') {
      const data = await this.imagesService.create({ blob: images });
      if (!data) {
        throw data;
      }
      imageIDs.push(data.id);
      return [...imageIDs];
    }
    for (const elem of images) {
      const data = await this.imagesService.create({ blob: elem });
      if (!data) {
        throw data;
      }
      imageIDs.push(data.id);
    }
    return [...imageIDs];
  }
  async create(createContentDto: CreateContentDto) {
    try {
      const { images, ...rest } = createContentDto;
      const imageIDs = await this.createAndGetImagesId(images);
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
      let imageIDs = [];
      let updateData: any = { ...rest };

      const content = await this.findOne(id);

      if (!content) {
        throw new NotFoundException(`Content with id: ${id} not found`);
      }
      const tmp = content.images.slice(images.length);
      if (tmp) {
        for (const elem of tmp) {
          await this.imagesService.remove(elem);
        }
      }
      if (images) {
        if (content.images[0]) {
          for (let i = 0; i < images.length; i++) {
            if (content.images[i]) {
              const { id: imgId } = await this.imagesService.update(
                content.images[i],
                {
                  blob: images[i],
                },
              );
              imageIDs.push(imgId);
            } else {
              const data = await this.imagesService.create({ blob: images[i] });
              if (!data) {
                throw data;
              }
              imageIDs.push(data.id);
            }
          }
        } else {
          const array = [...(await this.createAndGetImagesId(images))];
          imageIDs = [...array];
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
        for (const elem of content.images) {
          await this.imagesService.remove(elem);
        }
      }
      await content.deleteOne({ id });
      return content;
    } catch (err) {
      throw err;
    }
  }
}
