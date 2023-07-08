import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable, catchError, map, of } from 'rxjs';

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T | null;
}

@Injectable()
export class ApiResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  static getStatusCodeAndMessageFromError(err: Error) {
    const { message } = err;
    const statusCode =
      err instanceof HttpException
        ? err.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    return { message, statusCode };
  }

  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiResponse<T>> {
    const response = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      map((data) => ({
        statusCode: response.statusCode,
        message: '',
        data,
      })),
      catchError((err: Error) => {
        const { statusCode, message } =
          ApiResponseInterceptor.getStatusCodeAndMessageFromError(err);
        response.status(statusCode);

        return of({
          statusCode,
          message,
          data: null,
        });
      }),
    );
  }
}
