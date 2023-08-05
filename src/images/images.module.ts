import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ImageSchema } from './schema/image.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Image', schema: ImageSchema }]),
  ],
  providers: [ImagesService],
  exports: [ImagesService],
})
export class ImagesModule {}
