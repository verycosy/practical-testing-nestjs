import { BaseIdEntity } from 'src/entity/base-id-entity';
import { Entity } from 'typeorm';

@Entity()
export class TestEntity extends BaseIdEntity {}
