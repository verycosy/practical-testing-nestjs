import { LocalDateTime } from '@js-joda/core';
import { BaseTimeEntity } from 'src/entity/base-time-entity';
import { LocalDateTimeColumn } from 'src/entity/columns/local-date-time.column';
import { ClassEnumColumn } from 'src/entity/columns/class-enum.column';
import { Entity } from 'typeorm';
import { SampleStatus } from './sample-status';

@Entity()
export class Sample extends BaseTimeEntity {
  constructor(params: CreateSampleParams) {
    super();

    const { status = SampleStatus.READY, checkedAt = null } = params;

    this.status = status;
    this.checkedAt = checkedAt;
  }

  @ClassEnumColumn(SampleStatus)
  status: SampleStatus;

  @LocalDateTimeColumn({
    nullable: true,
  })
  checkedAt: LocalDateTime | null;
}

interface CreateSampleParams {
  status?: SampleStatus;
  checkedAt?: LocalDateTime;
}
