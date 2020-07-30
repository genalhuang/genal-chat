import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptor/response.interceptor';
import { join } from 'path';
import { logger } from './common/middleware/logger.middleware';

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 全局中间件
  app.useGlobalInterceptors(new ResponseInterceptor());

  // 全局过滤器
  app.useGlobalFilters(new HttpExceptionFilter());

  // 全局中间件
  app.use(logger);

  // 配置静态资源
  app.useStaticAssets(join(__dirname, '../public', '/'), {
    prefix: '/',
  });

  await app.listen(3000);
}
bootstrap();
