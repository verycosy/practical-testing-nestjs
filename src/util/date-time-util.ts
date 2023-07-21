import {
  DateTimeFormatter,
  LocalDate,
  LocalDateTime,
  convert,
  nativeJs,
} from '@js-joda/core';

export class DateTimeUtil {
  private static LOCAL_DATE_FORMATTER =
    DateTimeFormatter.ofPattern('yyyy-MM-dd');
  private static LOCAL_DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern(
    'yyyy-MM-dd HH:mm:ss',
  );

  static toDate(localDate: LocalDate | LocalDateTime): Date {
    return convert(localDate).toDate();
  }

  static toLocalDate(date: Date): LocalDate {
    return LocalDate.from(nativeJs(date));
  }

  static toLocalDateTime(date: Date): LocalDateTime {
    return LocalDateTime.from(nativeJs(date));
  }

  static toLocalDateBy(str: string) {
    return LocalDate.parse(str, DateTimeUtil.LOCAL_DATE_FORMATTER);
  }

  static toLocalDateTimeBy(str: string) {
    return LocalDateTime.parse(str, DateTimeUtil.LOCAL_DATE_TIME_FORMATTER);
  }
}
