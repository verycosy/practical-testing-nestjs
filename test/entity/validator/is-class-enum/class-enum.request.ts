import { IsClassEnum } from 'src/entity/validator/is-class-enum';
import { ClassEnumStatus } from './class-enum-status';
import { IsOptional } from 'class-validator';

export class ClassEnumRequest {
  @IsClassEnum(ClassEnumStatus)
  status: ClassEnumStatus;

  @IsOptional()
  @IsClassEnum(ClassEnumStatus, {
    each: true,
  })
  statuses?: ClassEnumStatus[];
}
