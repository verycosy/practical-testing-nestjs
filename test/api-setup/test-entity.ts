import { BaseTimeEntity } from 'src/entity/base-time-entity';
import { Entity } from 'typeorm';

@Entity()
export class TestEntity extends BaseTimeEntity {}
