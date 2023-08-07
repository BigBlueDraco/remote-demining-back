import { Controller, Get, Param, Res } from '@nestjs/common';
import { Readable } from 'stream';
import { ImagesService } from './images.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Images')
@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}
  @Get('/:id')
  async findOne(@Param('id') id: string, @Res() res: any) {
    const { blob } = await this.imagesService.findOne(id);
    const base64EncodedImage = blob;

    const buffer = Buffer.from(base64EncodedImage, 'base64');
    const filename = 'image.png';

    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    res.setHeader('Content-Type', 'image/png');

    const readableStream = new Readable();
    readableStream.push(buffer);
    readableStream.push(null);

    readableStream.pipe(res);
  }
}
