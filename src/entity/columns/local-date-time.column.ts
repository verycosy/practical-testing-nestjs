import { Column, ColumnOptions } from 'typeorm';
import { LocalDateTimeTransformer } from '../transformers/local-date-time.transformer';

export const LocalDateTimeColumn = (
  options?: Omit<ColumnOptions, 'transformer' | 'type'>,
) => {
  return Column({
    transformer: LocalDateTimeTransformer,
    type: 'timestamptz',
    ...options,
  });
};
