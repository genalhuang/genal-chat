import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { logger } from './common/middleware/logger.middleware';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 全局使用中间件
  app.use(logger)
  
  // 全局过滤器
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(3000);
}
bootstrap();
