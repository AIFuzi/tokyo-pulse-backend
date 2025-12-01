import * as sharp from 'sharp'
import { v4 } from 'uuid'

import { Injectable } from '@nestjs/common'
import { S3Service } from '@/src/common/modules/libs/s3/s3.service'
import { CreateNewsDto } from '@/src/common/modules/news/dto'
import { PrismaService } from '@/src/core/prisma/prisma.service'

@Injectable()
export class NewsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly s3: S3Service,
  ) {}

  async uploadFile(file: Express.Multer.File) {
    const processedBuffer = await sharp(file.buffer)
      .resize(1280, 720)
      .webp()
      .toBuffer()

    const newNameFile = v4() + '.webp'

    await this.s3.upload(processedBuffer, newNameFile, file.mimetype)
    return { url: `http://localhost:9000/tokyo-pulse/${newNameFile}` }
  }

  async create(dto: CreateNewsDto, image: Express.Multer.File, userId: string) {
    const { title, description } = dto

    const processedBuffer = await sharp(image.buffer)
      .resize(1280, 720)
      .webp()
      .toBuffer()

    const newNameFile = v4() + '.webp'

    await this.s3.upload(processedBuffer, newNameFile, image.mimetype)

    return this.prismaService.news.create({
      data: {
        title,
        description,
        userId,
        image: newNameFile,
      },
    })
  }

  async remove() {}

  async getAll() {}

  async getOne(id: string) {}
}
