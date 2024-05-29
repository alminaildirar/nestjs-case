import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
  } from '@nestjs/common';
  import { Observable, throwError } from 'rxjs';
  import { map, catchError } from 'rxjs/operators';
  import { ResponseDTO } from '../dto/response.dto';
  
  @Injectable()
  export class ResponseInterceptor<T>
    implements NestInterceptor<T, ResponseDTO<T>>
  {
    intercept(
      context: ExecutionContext,
      next: CallHandler,
    ): Observable<ResponseDTO<T>> {
      return next.handle().pipe(
        map((data) => {
          const response = context.switchToHttp().getResponse();
          const statusCode = response.statusCode;
          if (statusCode >= 200 && statusCode < 300) {
            return {
              statusCode: statusCode,
              message: 'Success',
              data,
            };
          }
          return data;
        }),
        catchError((error) => {
          //console.error('Error response', error);
          return throwError(() => error);
        }),
      );
    }
  }
  