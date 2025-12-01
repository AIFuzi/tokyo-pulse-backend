import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from '@/src/common/modules/auth/auth.module'
import { S3Module } from '@/src/common/modules/libs/s3/s3.module'
import { NewsModule } from '@/src/common/modules/news/news.module'
import { PrismaModule } from '@/src/core/prisma/prisma.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    S3Module,
    AuthModule,
    NewsModule,
  ],
})
export class CoreModule {}
