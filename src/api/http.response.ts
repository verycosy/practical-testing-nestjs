import { ApiProperty } from '@nestjs/swagger';

export class HttpResponse<T> {
  constructor(params: HttpResponse<T>) {
    Object.assign(this, params);
  }

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
}
