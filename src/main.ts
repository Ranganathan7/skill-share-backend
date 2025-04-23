import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { swaggerConstants } from './common/constants/constants';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Create congig service instance for all the configs.
  const configService = app.get<ConfigService>(ConfigService);

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle(swaggerConstants.name)
    .setDescription(swaggerConstants.description)
    .setVersion(swaggerConstants.version)
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(swaggerConstants.uri, app, documentFactory);

  // Enable validation pipe to apply any param/class validations
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.listen(configService.get<number>('app.port') ?? 3000);
}
bootstrap();
