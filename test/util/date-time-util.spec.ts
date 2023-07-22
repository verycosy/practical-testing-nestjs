import { LocalDate, LocalDateTime } from '@js-joda/core';
import { DateTimeUtil } from 'src/util/date-time-util';

describe('DateTimeUtil', () => {
  it('yyyy-MM-dd 포맷의 문자열을 LocalDate 객체로 변환한다', () => {
    // given
    const str = '2023-07-21';
    const localDate = LocalDate.of(2023, 7, 21);

    // when
    const result = DateTimeUtil.toLocalDateBy(str);

    // then
    expect(result).toBeInstanceOf(LocalDate);
    expect(result.isEqual(localDate)).toBe(true);
  });

  it('yyyy-MM-dd HH:mm:ss 포맷의 문자열을 LocalDateTime 객체로 변환한다', () => {
    // given
    const str = '2023-07-21 23:05:30';
    const localDateTime = LocalDateTime.of(2023, 7, 21, 23, 5, 30);

    // when
    const result = DateTimeUtil.toLocalDateTimeBy(str);

    // then
    expect(result).toBeInstanceOf(LocalDateTime);
    expect(result.isEqual(localDateTime)).toBe(true);
  });

  it('LocalDate 객체를 yyyy-MM-dd 포맷의 문자열로 변환한다', () => {
    // given
    const str = '2023-07-21';
    const localDate = LocalDate.of(2023, 7, 21);

    // when
    const result = DateTimeUtil.toString(localDate);

    // then
    expect(result).toBe(str);
  });

  it('LocalDateTime 객체를 yyyy-MM-dd HH:mm:ss 포맷의 문자열로 변환한다', () => {
    // given
    const str = '2023-07-21 23:05:30';
    const localDateTime = LocalDateTime.of(2023, 7, 21, 23, 5, 30);

    // when
    const result = DateTimeUtil.toString(localDateTime);

    // then
    expect(result).toBe(str);
  });
});
