import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { LocalDateTestRequest } from './local-date-test.request';
import { LocalDate } from '@js-joda/core';

describe('IsLocalDate', () => {
  describe('plainToInstance', () => {
    it('변환할 값이 LocalDate로 변환 가능하면 LocalDate로 반환한다', () => {
      // given
      const body = {
        startDate: '2023-07-21',
        dates: ['2023-07-21', '2023-07-28'],
      };

      // when
      const result = plainToInstance(LocalDateTestRequest, body);

      // then
      expect(result).toBeInstanceOf(LocalDateTestRequest);
      expect(result.startDate).toEqual(LocalDate.of(2023, 7, 21));
      expect(result.dates).toEqual([
        LocalDate.of(2023, 7, 21),
        LocalDate.of(2023, 7, 28),
      ]);
    });

    it('변환할 값이 LocalDate로 변환할 수 없으면 그대로 반환한다', () => {
      // given
      const body = {
        startDate: 'WRONG',
      };

      // when
      const result = plainToInstance(LocalDateTestRequest, body);

      // then
      expect(result).toBeInstanceOf(LocalDateTestRequest);
      expect(result.startDate).toBe('WRONG');
    });
  });

  describe('validate', () => {
    it('유효하지 않은 값이면 에러 메시지를 반환한다', async () => {
      // given
      const body = plainToInstance(LocalDateTestRequest, {
        startDate: 'wrong',
      });

      // when
      const result = await validate(body);

      // then
      expect(result).toHaveLength(1);
      expect(result[0].constraints?.isLocalDate).toBe(
        'wrong는 유효하지 않은 값입니다.',
      );
    });

    it('배열에 유효하지 않은 값이 섞여 있으면 에러 메시지를 반환한다', async () => {
      // given
      const body = plainToInstance(LocalDateTestRequest, {
        startDate: '2023-07-21',
        dates: ['WRONG', '2023-07-28', 'WRONG2'],
      });

      // when
      const result = await validate(body);

      // then
      expect(result).toHaveLength(1);
      expect(result[0].constraints?.isLocalDate).toBe(
        'WRONG, WRONG2는 유효하지 않은 값입니다.',
      );
    });
  });
});
