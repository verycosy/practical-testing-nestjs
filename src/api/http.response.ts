import { ApiProperty } from '@nestjs/swagger';

export class HttpResponse<T> {
  @ApiProperty()
  readonly statusCode: number;

  @ApiProperty({
    oneOf: [
      {
        type: 'string',
      },
      {
        type: 'array',
        items: {
          type: 'string',
        },
      },
    ],
    description: '문자열 혹은 문자열 배열',
  })
  readonly message: string | string[];

  readonly data: T | null;

  constructor(params: HttpResponse<T>) {
    this.statusCode = params.statusCode;
    this.data = params.data;
    this.message = params.message;
  }
}
