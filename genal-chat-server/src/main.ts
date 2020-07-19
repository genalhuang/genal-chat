import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { logger } from './common/middleware/logger.middleware';
import { join } from 'path'

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 全局中间件
  app.use(logger)
  
  // 全局过滤器
  app.useGlobalFilters(new HttpExceptionFilter());

  // 配置静态资源
  app.useStaticAssets(join(__dirname, '../public/', 'static'), {
    prefix: '/static/', 
  });

  await app.listen(3000);
}
bootstrap();
