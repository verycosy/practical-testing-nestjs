import { LocalDateTime } from '@js-joda/core';
import { BaseTimeEntity } from 'src/entity/base-time-entity';
import { LocalDateTimeColumn } from 'src/entity/columns/local-date-time.column';
import { ClassEnumColumn } from 'src/entity/columns/class-enum.column';
import { Column, Entity } from 'typeorm';
import { SampleStatus } from './sample-status';

@Entity()
export class Sample extends BaseTimeEntity {
  constructor(params: CreateSampleParams) {
    super();

    const { text, status = SampleStatus.READY, checkedAt = null } = params;

    this.text = text;
    this.status = status;
    this.checkedAt = checkedAt;
  }

  @Column()
  text: string;

  @ClassEnumColumn(SampleStatus)
  status: SampleStatus;

  @LocalDateTimeColumn({
    nullable: true,
  })
  checkedAt: LocalDateTime | null;
}

interface CreateSampleParams {
  text: string;
  status?: SampleStatus;
  checkedAt?: LocalDateTime;
}
