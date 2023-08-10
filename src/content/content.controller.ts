import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ContentService } from './content.service';
import { ContentFilterDto } from './dto/content-filter.dto';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { Content } from './entities/content.entity';

@ApiTags('Content')
@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Post()
  @UsePipes(ValidationPipe)
  @ApiCreatedResponse({
    description: 'Content created. Returns the created content',
    type: Content,
  })
  @ApiInternalServerErrorResponse({ description: 'Oops, something went wrong' })
  create(@Body() createContentDto: CreateContentDto) {
    return this.contentService.create(createContentDto);
  }

  @Get()
  @ApiOkResponse({
    description: 'Returns an array of all content',
    type: [Content],
  })
  @ApiInternalServerErrorResponse({ description: 'Oops, something went wrong' })
  @UsePipes(ValidationPipe)
  @ApiBody({ type: ContentFilterDto, required: false })
  @HttpCode(200)
  async findAll(@Body() body?: ContentFilterDto) {
    return await this.contentService.findAll(body);
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Returns content', type: Content })
  @ApiInternalServerErrorResponse({ description: 'Oops, something went wrong' })
  @HttpCode(200)
  @UsePipes(ValidationPipe)
  findOne(@Param('id') id: string) {
    return this.contentService.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse({
    description: 'Returns updated content',
    type: Content,
  })
  @ApiInternalServerErrorResponse({ description: 'Oops, something went wrong' })
  @UsePipes(ValidationPipe)
  @HttpCode(200)
  update(@Param('id') id: string, @Body() updateContentDto: UpdateContentDto) {
    return this.contentService.update(id, updateContentDto);
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'Returns deleted content', type: Content })
  @ApiInternalServerErrorResponse({ description: 'Oops, something went wrong' })
  @UsePipes(ValidationPipe)
  @HttpCode(200)
  remove(@Param('id') id: string) {
    return this.contentService.remove(id);
  }
}
