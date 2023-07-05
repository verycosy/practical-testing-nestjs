import { LocalDate, LocalDateTime, convert, nativeJs } from '@js-joda/core';

export class DateTimeUtil {
  static toDate(localDate: LocalDate | LocalDateTime): Date {
    return convert(localDate).toDate();
  }

  static toLocalDate(date: Date): LocalDate {
    return LocalDate.from(nativeJs(date));
  }

  static toLocalDateTime(date: Date): LocalDateTime {
    return LocalDateTime.from(nativeJs(date));
  }
}
