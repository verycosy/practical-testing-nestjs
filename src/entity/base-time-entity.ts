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
  createdAt!: LocalDateTime;

  @LocalDateTimeColumn()
  updatedAt!: LocalDateTime;

  @LocalDateTimeColumn({
    nullable: true,
  })
  deletedAt!: LocalDateTime | null;

  @BeforeInsert()
  private _insert() {
    this.createdAt = LocalDateTime.now();
    this.updatedAt = LocalDateTime.now();
  }

  @BeforeUpdate()
  private _update() {
    this.updatedAt = LocalDateTime.now();
  }

  @BeforeRemove()
  @BeforeSoftRemove()
  private _softRemove() {
    this.deletedAt = LocalDateTime.now();
  }
}
