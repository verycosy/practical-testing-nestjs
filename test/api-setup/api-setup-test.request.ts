import { IsPositive, IsString } from 'class-validator';

export class ApiSetupTestRequest {
  @IsString({ message: '이름은 문자열이어야 합니다.' })
  readonly name!: string;

  @IsPositive({
    message: ({ property, value }) => {
      return `나이(${property})는 양수이어야 합니다. (입력값 : ${value})`;
    },
  })
  readonly age!: number;
}
