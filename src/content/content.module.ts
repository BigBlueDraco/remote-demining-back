import { Module } from '@nestjs/common';
import { ContentService } from './content.service';
import { ContentController } from './content.controller';
import { MongooseModule } from '@nestjs/mongoose/dist/mongoose.module';
import { ContentSchema } from './schemas/content.schema';
import { ImagesModule } from 'src/images/images.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Content', schema: ContentSchema }]),
    ImagesModule,
  ],
  controllers: [ContentController],
  providers: [ContentService],
})
export class ContentModule {}
