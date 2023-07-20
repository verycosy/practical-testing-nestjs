import { PrimaryColumn } from 'typeorm';
import { v4 } from 'uuid';
import { BaseEntity } from './base-entity';

export abstract class BaseIdEntity extends BaseEntity {
  @PrimaryColumn({
    type: 'uuid',
  })
  readonly id!: string;

  constructor() {
    super();
    this.id = v4();
  }
}
