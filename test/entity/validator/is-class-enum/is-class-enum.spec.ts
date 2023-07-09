import { plainToInstance } from 'class-transformer';
import { ClassEnumRequest } from './class-enum.request';
import { validate } from 'class-validator';
import { ClassEnumStatus } from './class-enum-status';

describe('IsClassEnum', () => {
  describe('plainToInstance', () => {
    it('변환할 값이 ClassEnum으로 변환 가능하면 ClassEnum으로 반환한다', () => {
      // given
      const body = {
        status: 'wow',
        statuses: ['TODO', 'PROGRESS'],
      };

      // when
      const result = plainToInstance(ClassEnumRequest, body);

      // then
      expect(result).toBeInstanceOf(ClassEnumRequest);
      expect(result.statuses).toEqual([
        ClassEnumStatus.TODO,
        ClassEnumStatus.PROGRESS,
      ]);
    });

    it('변환할 값이 ClassEnum으로 변환할 수 없으면 그대로 반환한다', () => {
      // given
      const body = {
        status: 'WRONG',
      };

      // when
      const result = plainToInstance(ClassEnumRequest, body);

      // then
      expect(result).toBeInstanceOf(ClassEnumRequest);
      expect(result.status).toBe('WRONG');
    });
  });

  describe('validate', () => {
    it('유효하지 않은 값이면 에러 메시지를 반환한다', async () => {
      // given
      const body = plainToInstance(ClassEnumRequest, {
        status: 'wrong',
      });

      // when
      const result = await validate(body);

      // then
      expect(result).toHaveLength(1);
      expect(result[0].constraints?.isClassEnum).toBe(
        'wrong는 유효하지 않은 값입니다.',
      );
    });

    it('배열에 유효하지 않은 값이 섞여 있으면 에러 메시지를 반환한다', async () => {
      // given
      const body = plainToInstance(ClassEnumRequest, {
        status: 'TODO',
        statuses: ['WRONG', 'TODO', 'WRONG2'],
      });

      // when
      const result = await validate(body);

      // then
      expect(result).toHaveLength(1);
      expect(result[0].constraints?.isClassEnum).toBe(
        'WRONG, WRONG2는 유효하지 않은 값입니다.',
      );
    });
  });
});
