import { LocalDateTime } from '@js-joda/core';
import { BaseTimeEntity } from 'src/domain/base-time-entity';
import { LocalDateTimeColumn } from 'src/domain/columns/local-date-time.column';
import { Column, Entity } from 'typeorm';

@Entity()
export class Sample extends BaseTimeEntity {
  constructor(params: CreateSampleParams) {
    super();

    const { text, checkedAt = null } = params;
    this.text = text;
    this.checkedAt = checkedAt;
  }

  @Column()
  text: string;

  @LocalDateTimeColumn({
    nullable: true,
  })
  checkedAt: LocalDateTime | null;
}

interface CreateSampleParams {
  text: string;
  checkedAt?: LocalDateTime;
}
