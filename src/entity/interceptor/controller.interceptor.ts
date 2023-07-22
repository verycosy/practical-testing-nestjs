import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable, catchError, map, throwError } from 'rxjs';
import { HttpResponse } from 'src/api/http.response';
import { HttpExceptionConverter } from './http-exception-converter';

@Injectable()
export class ControllerInterceptor<T>
  implements NestInterceptor<T, HttpResponse<T | null>>
{
  constructor(
    private readonly httpExceptionConverter: HttpExceptionConverter,
  ) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<HttpResponse<T | null>> {
    const response = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      map(
        (data) =>
          new HttpResponse({
            statusCode: response.statusCode,
            message: '',
            data,
          }),
      ),
      catchError((cause: Error) => {
        return throwError(() => {
          return this.httpExceptionConverter.convert(cause);
        });
      }),
    );
  }
}
