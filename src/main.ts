import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { CoreModule } from '@/src/core/core/core.module'

async function bootstrap() {
  const app = await NestFactory.create(CoreModule)

  const config = app.get(ConfigService)

  app.setGlobalPrefix(config.getOrThrow<string>('GLOBAL_PREFIX'))
  app.useGlobalPipes(new ValidationPipe({ transform: true }))

  app.enableCors({
    origin: config.getOrThrow<string>('ALLOWED_ORIGINS'),
    credentials: true,
    exposeHeaders: ['set-cookie'],
  })

  await app.listen(config.getOrThrow<string>('PORT'))
}
void bootstrap()
