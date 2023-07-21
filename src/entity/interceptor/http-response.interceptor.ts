import {
  CallHandler,
  ExecutionContext,
  HttpExceptionOptions,
  Injectable,
  NestInterceptor,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable, catchError, map, throwError } from 'rxjs';
import { HttpResponse } from 'src/api/http.response';
import { DomainException } from '../exceptions/domain.exception';
import { EntityNotFoundError } from 'typeorm';

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
      catchError((cause: Error) => {
        return throwError(() => {
          const { message } = cause;
          const options: HttpExceptionOptions = {
            cause,
          };

          switch (cause.constructor) {
            case DomainException:
              return new UnprocessableEntityException(message, options);

            case EntityNotFoundError: {
              return new NotFoundException(
                '데이터를 찾을 수 없습니다.',
                options,
              );
            }

            default:
              return cause;
          }
        });
      }),
    );
  }
}
