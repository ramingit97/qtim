import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './exception-filters/http.filter';
import * as cookieParser from 'cookie-parser';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  // app.setGlobalPrefix("api");
  app.enableCors({
    credentials: true,
    origin: ['http://localhost:3001'],
  });
  app.use(cookieParser());
  await app.listen(3000);
}
bootstrap();
