import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as moment from 'moment-timezone';
import { ConfigService } from '@nestjs/config';
import * as bodyParser from 'body-parser';
import { SP_DEFAULT } from './config/constanst';
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './utils/setup-swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  moment.tz.setDefault('America/Bogota');

  app.enableCors();
  const configService = app.get(ConfigService);
  
  app.use(bodyParser.json({ limit: '5mb' }));
  app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));

  setupSwagger(app);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const port = configService.get<number>(SP_DEFAULT);
  await app.listen(port);
  
  console.log(`Application is running on: ${await app.getUrl()}/api`);
}
bootstrap();