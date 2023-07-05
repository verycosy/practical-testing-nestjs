import { LocalDateTime } from '@js-joda/core';
import {
  BeforeInsert,
  BeforeRemove,
  BeforeSoftRemove,
  BeforeUpdate,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { LocalDateTimeColumn } from './columns/local-date-time.column';

export abstract class BaseTimeEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @LocalDateTimeColumn()
  createdAt: LocalDateTime;

  @LocalDateTimeColumn()
  updatedAt: LocalDateTime;

  @LocalDateTimeColumn({
    nullable: true,
  })
  deletedAt: LocalDateTime | null;

  @BeforeInsert()
  private insert() {
    this.createdAt = LocalDateTime.now();
    this.updatedAt = LocalDateTime.now();
  }

  @BeforeUpdate()
  private update() {
    this.updatedAt = LocalDateTime.now();
  }

  @BeforeRemove()
  @BeforeSoftRemove()
  private softRemove() {
    this.deletedAt = LocalDateTime.now();
  }
}
