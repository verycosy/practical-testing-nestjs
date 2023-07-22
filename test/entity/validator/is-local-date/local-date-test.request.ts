import { LocalDate } from '@js-joda/core';
import { IsOptional } from 'class-validator';
import { IsLocalDate } from 'src/entity/validator/is-local-date';

export class LocalDateTestRequest {
  @IsLocalDate()
  startDate!: LocalDate;

  @IsOptional()
  @IsLocalDate({
    each: true,
  })
  dates?: LocalDate[];
}
