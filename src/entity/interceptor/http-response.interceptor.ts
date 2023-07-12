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
import { HttpResponse } from 'src/api/http.response';

interface HttpExceptionResponse {
  message: string | string[];
  error: string;
  statusCode: number;
}

@Injectable()
export class HttpResponseInterceptor<T>
  implements NestInterceptor<T, HttpResponse<T | null>>
{
  private readonly logger = new Logger(HttpResponseInterceptor.name);

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
        this.logger.error(err, err.stack);

        const { statusCode, message } =
          HttpResponseInterceptor.getStatusCodeAndMessageFromError(err);
        response.status(statusCode);

        return of(
          new HttpResponse({
            statusCode,
            message,
            data: null,
          }),
        );
      }),
    );
  }
}
