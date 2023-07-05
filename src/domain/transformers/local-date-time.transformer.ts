import { LocalDateTime } from '@js-joda/core';
import { DateTimeUtil } from 'src/util/date-time-util';
import { createValueTransformer } from './create-value-transformer';

export const LocalDateTimeTransformer = createValueTransformer({
  to(entityValue: LocalDateTime | null): Date | null {
    if (entityValue instanceof LocalDateTime) {
      return DateTimeUtil.toDate(entityValue);
    }

    return null;
  },
  from(databaseValue: Date | null): LocalDateTime | null {
    if (databaseValue instanceof Date) {
      return DateTimeUtil.toLocalDateTime(databaseValue);
    }

    return null;
  },
});
