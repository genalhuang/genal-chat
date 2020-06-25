import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter<HttpException> {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();
    console.log(exception)
    const exceptionRes: any = exception.getResponse();
    const {
      error,
      message,
    } = exceptionRes;
    
    response.status(status).json({
      status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error,
      message,
    });
  }
}