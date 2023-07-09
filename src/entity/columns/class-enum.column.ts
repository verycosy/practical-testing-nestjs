import { Column, ColumnOptions } from 'typeorm';
import {
  ClassEnum,
  ClassEnumTransformer,
} from '../transformers/class-enum.transformer';

export const ClassEnumColumn = (
  clazz: Omit<ClassEnum, 'new'>,
  options?: Omit<ColumnOptions, 'transformer' | 'type'>,
) => {
  return Column({
    type: 'varchar',
    length: 40,
    transformer: ClassEnumTransformer(clazz as ClassEnum),
    ...options,
  });
};
