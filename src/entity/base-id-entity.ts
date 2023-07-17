import { PrimaryGeneratedColumn } from 'typeorm';

export abstract class BaseIdEntity {
  @PrimaryGeneratedColumn('increment')
  id!: number;
}
