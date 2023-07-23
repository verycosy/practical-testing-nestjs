import { Entity, Column } from 'typeorm';
import { BaseIdEntity } from 'src/entity/base-id-entity';

@Entity()
export class TestEntity extends BaseIdEntity {
  @Column()
  readonly text: string;

  constructor(text: string) {
    super();
    this.text = text;
  }
}
