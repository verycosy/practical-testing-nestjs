import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable, catchError, map, of } from 'rxjs';

interface HttpExceptionResponse {
  message: string | string[];
  error: string;
  statusCode: number;
}

export interface ApiResponse<T> extends Omit<HttpExceptionResponse, 'error'> {
  data: T | null;
}

@Injectable()
export class ApiResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  private readonly logger = new Logger(ApiResponseInterceptor.name);

  static getStatusCodeAndMessageFromError(err: Error) {
    if (err instanceof HttpException) {
      return err.getResponse() as HttpExceptionResponse;
    }

    return {
      message: err.message,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    };
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
        this.logger.error(err, err.stack);

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
