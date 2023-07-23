import { Entity, Column } from 'typeorm';
import { BaseTimeEntity } from 'src/entity/base-time-entity';

@Entity()
export class TestEntity extends BaseTimeEntity {
  @Column()
  readonly text: string;

  constructor(text: string) {
    super();
    this.text = text;
  }
}
