import { ApiProperty } from '@nestjs/swagger';

export class HttpResponse<T> {
  constructor(params: HttpResponse<T>) {
    Object.assign(this, params);
  }

  @ApiProperty()
  readonly statusCode: number;

  @ApiProperty()
  readonly message: string | string[];

  @ApiProperty()
  readonly data: T | null;
}
