import { Column, ColumnOptions } from 'typeorm';
import {
  ClassEnum,
  ClassEnumTransformer,
} from '../transformers/class-enum.transformer';

export const ClassEnumColumn = (
  classEnum: ClassEnum,
  options?: Omit<ColumnOptions, 'transformer' | 'type'>,
) => {
  return Column({
    type: 'varchar',
    length: 40,
    transformer: ClassEnumTransformer(classEnum),
    ...options,
  });
};
