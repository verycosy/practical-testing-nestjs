import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable, catchError, map, throwError } from 'rxjs';
import { HttpResponse } from 'src/api/http.response';
import { DomainException } from '../exceptions/domain.exception';

@Injectable()
export class HttpResponseInterceptor<T>
  implements NestInterceptor<T, HttpResponse<T | null>>
{
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
      catchError((err: Error) => {
        return throwError(() => {
          if (err.name === DomainException.name) {
            return new UnprocessableEntityException(err.message, {
              cause: err,
            });
          }

          return err;
        });
      }),
    );
  }
}
