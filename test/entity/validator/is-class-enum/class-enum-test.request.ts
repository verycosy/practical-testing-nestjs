import { IsClassEnum } from 'src/entity/validator/is-class-enum';
import { ClassEnumTestStatus } from './class-enum-test-status';
import { IsOptional } from 'class-validator';

export class ClassEnumTestRequest {
  @IsClassEnum(ClassEnumTestStatus)
  status!: ClassEnumTestStatus;

  @IsOptional()
  @IsClassEnum(ClassEnumTestStatus, {
    each: true,
  })
  statuses?: ClassEnumTestStatus[];
}
