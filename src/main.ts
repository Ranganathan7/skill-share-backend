import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Create congig service instance for all the configs.
  const configService = app.get<ConfigService>(ConfigService);

  await app.listen(configService.get<number>('app.port') ?? 3000);
}
bootstrap();
