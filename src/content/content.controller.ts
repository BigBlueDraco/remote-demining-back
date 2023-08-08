import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ContentService } from './content.service';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ContentFilterDto } from './dto/content-filter.dto';

@ApiTags('Content')
@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Post()
  @UsePipes(ValidationPipe)
  @ApiCreatedResponse({ description: 'Content created' })
  @ApiInternalServerErrorResponse({ description: 'Oh, something went wrong' })
  create(@Body() createContentDto: CreateContentDto) {
    return this.contentService.create(createContentDto);
  }

  @Get()
  @ApiOkResponse({ description: 'OK' })
  @ApiInternalServerErrorResponse({ description: 'Oh, something went wrong' })
  @UsePipes(ValidationPipe)
  @ApiBody({ type: ContentFilterDto, required: false })
  @HttpCode(200)
  async findAll(@Body() body?: ContentFilterDto) {
    return await this.contentService.findAll(body);
  }

  @Get(':id')
  @ApiOkResponse({ description: 'OK' })
  @ApiInternalServerErrorResponse({ description: 'Oh, something went wrong' })
  @HttpCode(200)
  @UsePipes(ValidationPipe)
  findOne(@Param('id') id: string) {
    return this.contentService.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse({ description: 'OK' })
  @ApiInternalServerErrorResponse({ description: 'Oh, something went wrong' })
  @UsePipes(ValidationPipe)
  @HttpCode(200)
  update(@Param('id') id: string, @Body() updateContentDto: UpdateContentDto) {
    return this.contentService.update(id, updateContentDto);
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'OK' })
  @ApiInternalServerErrorResponse({ description: 'Oh, something went wrong' })
  @UsePipes(ValidationPipe)
  @HttpCode(200)
  remove(@Param('id') id: string) {
    return this.contentService.remove(id);
  }
}