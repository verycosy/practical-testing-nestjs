import { LocalDateTime } from '@js-joda/core';
import {
  BeforeInsert,
  BeforeRemove,
  BeforeSoftRemove,
  BeforeUpdate,
} from 'typeorm';
import { LocalDateTimeColumn } from './columns/local-date-time.column';
import { BaseIdEntity } from './base-id-entity';

export abstract class BaseTimeEntity extends BaseIdEntity {
  @LocalDateTimeColumn()
  readonly createdAt!: LocalDateTime;

  @LocalDateTimeColumn()
  readonly updatedAt!: LocalDateTime;

  @LocalDateTimeColumn({
    nullable: true,
  })
  readonly deletedAt!: LocalDateTime | null;

  @BeforeInsert()
  private _insert() {
    const now = LocalDateTime.now();

    this.mutable.createdAt = now;
    this.mutable.updatedAt = now;
  }

  @BeforeUpdate()
  private _update() {
    this.mutable.updatedAt = LocalDateTime.now();
  }

  @BeforeRemove()
  @BeforeSoftRemove()
  private _softRemove() {
    this.mutable.deletedAt = LocalDateTime.now();
  }
}
