import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Injectable,
} from '@nestjs/common';
import { Response } from 'express';
import { map } from 'rxjs/operators';
import { RCode } from '../constant/rcode';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): import('rxjs').Observable<any> | Promise<import('rxjs').Observable<any>> {
    const response = context.switchToHttp().getResponse<Response>();
    return next.handle().pipe(
      map(content => {
        return {
          data: content.data || {},
          code: content.code || RCode.OK,
          msg: content.msg || null,
        };
      }),
    );
  }
}