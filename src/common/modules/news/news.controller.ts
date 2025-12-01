import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { CreateNewsDto } from '@/src/common/modules/news/dto'
import { Authorization, Authorized } from '@/src/shared/decorators'

import { NewsService } from './news.service'

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post('add-image')
  @UseInterceptors(FileInterceptor('image'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.newsService.uploadFile(file)
  }

  @Authorization('ADMIN')
  @Post('create')
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateNewsDto,
    @Authorized('id') userId: string,
  ) {
    return this.newsService.create(dto, file, userId)
  }
}
