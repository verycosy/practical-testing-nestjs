import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sample } from './sample.entity';
import { SampleRepository } from './sample.repository';
import {
  And,
  Between,
  DataSource,
  Equal,
  In,
  IsNull,
  LessThanOrEqual,
  MoreThanOrEqual,
  Not,
} from 'typeorm';
import { LocalDateTime } from '@js-joda/core';
import { CoreModule } from 'src/core.module';
import { DateTimeUtil } from 'src/util/date-time-util';
import { SampleStatus } from './sample-status';

describe('SampleRepository', () => {
  let sampleRepository: SampleRepository;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [CoreModule, TypeOrmModule.forFeature([Sample])],
      providers: [SampleRepository],
    }).compile();

    sampleRepository = module.get(SampleRepository);
  });

  afterEach(async () => {
    await sampleRepository.clear();
  });

  afterAll(async () => {
    await module.get(DataSource).destroy();
  });

  // TODO:
  describe('BaseRepository', () => {
    it('기본 repository 메서드(find, save) 정상 작동', async () => {
      // given
      const sample = new Sample({
        text: 'hello',
      });

      // when
      const result = await sampleRepository.save(sample);

      // then
      expect(result.id).toBe(1);
      expect(result.text).toBe('hello');

      const samples = await sampleRepository.find();
      expect(samples).toHaveLength(1);
    });

    it('기본 레포지토리 확장 메서드', async () => {
      // given
      const sample1 = new Sample({
        text: 'real sample1',
      });
      const sample2 = new Sample({
        text: 'real sample2',
      });
      const sample3 = new Sample({
        text: 'fake sample1',
      });
      await sampleRepository.save([sample1, sample2, sample3]);

      // when
      const result = await sampleRepository.findContainsText('real');

      // then
      expect(result).toHaveLength(2);
    });
  });

  describe('LocalDateTimeColumn', () => {
    it('Entity<->DB', async () => {
      // given
      const sample = new Sample({
        text: 'hello',
      });

      // when
      const result = await sampleRepository.save(sample);

      // then
      expect(result.checkedAt).toBeNull();
      expect(result.createdAt).toBeInstanceOf(LocalDateTime);
      expect(result.updatedAt).toBeInstanceOf(LocalDateTime);
      expect(result.deletedAt).toBeNull();
    });
  });

  describe('find 메서드와 FindOperator', () => {
    const createFixture = async () => {
      const sample1 = new Sample({
        text: 'sample1',
        checkedAt: LocalDateTime.of(2023, 7, 4, 23, 59, 59),
      });
      const sample2 = new Sample({
        text: 'sample2',
        checkedAt: LocalDateTime.of(2023, 7, 5, 0, 0, 0),
      });
      const sample3 = new Sample({
        text: 'sample3',
        checkedAt: LocalDateTime.of(2023, 7, 5, 23, 59, 59),
      });
      const sample4 = new Sample({
        text: 'sample4',
        checkedAt: LocalDateTime.of(2023, 7, 6, 0, 0, 0),
      });
      const sample5 = new Sample({
        text: 'sample5',
      });
      await sampleRepository.save([
        sample1,
        sample2,
        sample3,
        sample4,
        sample5,
      ]);
    };

    it('equal', async () => {
      // given
      await createFixture();

      // when
      const result = await sampleRepository.find({
        where: {
          checkedAt: Equal(LocalDateTime.of(2023, 7, 5, 0, 0, 0)),
        },
      });

      // then
      expect(result).toHaveLength(1);
    });

    it('more than equal', async () => {
      // given
      await createFixture();

      // when
      const result = await sampleRepository.find({
        where: {
          checkedAt: MoreThanOrEqual(LocalDateTime.of(2023, 7, 5, 0, 0, 0)),
        },
      });

      // then
      expect(result).toHaveLength(3);
    });

    it('between', async () => {
      // given
      await createFixture();

      // when
      const result = await sampleRepository.find({
        where: {
          checkedAt: Between(
            LocalDateTime.of(2023, 7, 5, 0, 0, 0),
            LocalDateTime.of(2023, 7, 5, 23, 59, 59),
          ),
        },
      });

      // then
      expect(result).toHaveLength(2);
    });

    it('not between', async () => {
      // given
      await createFixture();

      // when
      const result = await sampleRepository.find({
        where: {
          checkedAt: Not(
            Between(
              LocalDateTime.of(2023, 7, 5, 0, 0, 0),
              LocalDateTime.of(2023, 7, 5, 23, 59, 59),
            ),
          ),
        },
      });

      // then
      expect(result).toHaveLength(2);
    });

    it('and', async () => {
      // given
      await createFixture();

      // when
      const result = await sampleRepository.find({
        where: {
          checkedAt: And(
            MoreThanOrEqual(LocalDateTime.of(2023, 7, 5, 0, 0, 0)),
            LessThanOrEqual(LocalDateTime.of(2023, 7, 5, 23, 59, 59)),
          ),
        },
      });

      // then
      expect(result).toHaveLength(2);
    });

    it('null', async () => {
      // given
      await createFixture();

      // when
      const result = await sampleRepository.find({
        where: {
          checkedAt: IsNull(),
        },
      });

      // then
      expect(result).toHaveLength(1);
    });

    it('not null', async () => {
      // given
      await createFixture();

      // when
      const result = await sampleRepository.find({
        where: {
          checkedAt: Not(IsNull()),
        },
      });

      // then
      expect(result).toHaveLength(4);
    });

    // TODO: not and, not equal
  });

  describe('QueryBuilder', () => {
    // given
    const createFixture = async () => {
      const sample1 = new Sample({
        text: 'sample1',
        checkedAt: LocalDateTime.of(2023, 7, 4, 23, 59, 59),
      });
      const sample2 = new Sample({
        text: 'sample2',
        checkedAt: LocalDateTime.of(2023, 7, 5, 0, 0, 0),
      });
      const sample3 = new Sample({
        text: 'sample3',
        checkedAt: LocalDateTime.of(2023, 7, 5, 23, 59, 59),
      });
      const sample4 = new Sample({
        text: 'sample4',
        checkedAt: LocalDateTime.of(2023, 7, 6, 0, 0, 0),
      });
      const sample5 = new Sample({
        text: 'sample5',
      });
      await sampleRepository.save([
        sample1,
        sample2,
        sample3,
        sample4,
        sample5,
      ]);
    };

    // NOTE: 이건 사실상 내부적으로는 Equal(checkedAt)을 넣은 것과 같아서, FindOperator를 쓴 것과 다름 없다
    it('equal', async () => {
      // given
      await createFixture();
      const checkedAt = LocalDateTime.of(2023, 7, 5, 0, 0, 0);

      // when
      const result = await sampleRepository
        .createQueryBuilder()
        .where({
          checkedAt,
        })
        .getMany();

      // then
      expect(result).toHaveLength(1);
    });

    it('between', async () => {
      // given
      await createFixture();

      // when
      const result = await sampleRepository
        .createQueryBuilder()
        .where({
          checkedAt: Between(
            LocalDateTime.of(2023, 7, 5, 0, 0, 0),
            LocalDateTime.of(2023, 7, 5, 23, 59, 59),
          ),
        })
        .getMany();

      // then
      expect(result).toHaveLength(2);
    });

    it('between with parameter', async () => {
      // given
      await createFixture();
      const from = DateTimeUtil.toDate(LocalDateTime.of(2023, 7, 5, 0, 0, 0));
      const to = DateTimeUtil.toDate(LocalDateTime.of(2023, 7, 5, 23, 59, 59));

      // when
      const result = await sampleRepository
        .createQueryBuilder('sample')
        .where(`sample.checked_at BETWEEN :from AND :to`, {
          from,
          to,
        })
        .getMany();

      // then
      expect(result).toHaveLength(2);
    });
  });

  describe('ClassEnumColumn', () => {
    it('Entity<->DB', async () => {
      // given / when
      const sample = new Sample({
        text: 'hello',
        status: SampleStatus.DONE,
      });
      const result = await sampleRepository.save(sample);

      // then
      expect(result.status).toBe(SampleStatus.DONE);
    });

    describe('find 메서드로 조회', () => {
      it('equal', async () => {
        // given
        await createFixture();

        // when
        const result = await sampleRepository.find({
          where: {
            status: SampleStatus.READY,
          },
        });

        // then
        expect(result).toHaveLength(1);
      });

      it('or', async () => {
        // given
        await createFixture();

        // when
        const result = await sampleRepository.find({
          where: [
            {
              status: SampleStatus.READY,
            },
            {
              status: SampleStatus.PROGRESS,
            },
          ],
        });

        // then
        expect(result).toHaveLength(3);
      });

      it('in', async () => {
        // given
        await createFixture();

        // when
        const result = await sampleRepository.find({
          where: {
            status: In([SampleStatus.READY, SampleStatus.DONE]),
          },
        });

        // then
        expect(result).toHaveLength(4);
      });

      it('not', async () => {
        // given
        await createFixture();

        // when
        const result = await sampleRepository.find({
          where: {
            status: Not(SampleStatus.DONE),
          },
        });

        // then
        expect(result).toHaveLength(3);
      });

      it('not and', async () => {
        // given
        await createFixture();

        // when
        const result = await sampleRepository.find({
          where: {
            status: And(Not(SampleStatus.READY), Equal(SampleStatus.PROGRESS)),
          },
        });

        // then
        expect(result).toHaveLength(2);
      });

      it('not is null', async () => {
        // given
        await createFixture();

        // when
        const notIsNullResults = await sampleRepository.find({
          where: {
            status: Not(IsNull()),
          },
        });

        // then
        expect(notIsNullResults).toHaveLength(6);
      });
    });

    describe('QueryBuilder', () => {
      it('equal', async () => {
        // given
        await createFixture();

        // when
        const result = await sampleRepository
          .createQueryBuilder('sample')
          .where({
            status: SampleStatus.READY,
          })
          .getMany();

        // then
        expect(result).toHaveLength(1);
      });

      it('in', async () => {
        // given
        await createFixture();

        // when
        const result = await sampleRepository
          .createQueryBuilder('sample')
          .where([
            {
              status: In([SampleStatus.READY, SampleStatus.PROGRESS]),
            },
          ])
          .getMany();

        // then
        expect(result).toHaveLength(3);
      });

      it('or', async () => {
        // given
        await createFixture();

        // when
        const result1 = await sampleRepository
          .createQueryBuilder('sample')
          .where([
            {
              status: SampleStatus.READY,
            },
            {
              status: SampleStatus.PROGRESS,
            },
          ])
          .getMany();

        const result2 = await sampleRepository
          .createQueryBuilder('sample')
          .where(`(sample.status = :status1 OR sample.status = :status2)`, {
            status1: SampleStatus.READY.code,
            status2: SampleStatus.PROGRESS.code,
          })
          .getMany();

        // getsql도 심지어 같은 동작

        // then
        expect(result1).toHaveLength(3);
        expect(result2).toHaveLength(3);
      });
    });

    const createFixture = async () => {
      const sample1 = new Sample({
        text: 'sample1',
        status: SampleStatus.READY,
      });
      const sample2 = new Sample({
        text: 'sample2',
        status: SampleStatus.PROGRESS,
      });
      const sample3 = new Sample({
        text: 'sample3',
        status: SampleStatus.PROGRESS,
      });
      const sample4 = new Sample({
        text: 'sample4',
        status: SampleStatus.DONE,
      });
      const sample5 = new Sample({
        text: 'sample5',
        status: SampleStatus.DONE,
      });
      const sample6 = new Sample({
        text: 'sample5',
        status: SampleStatus.DONE,
      });
      const samples = [sample1, sample2, sample3, sample4, sample5, sample6];
      await sampleRepository.save(samples);
    };
  });
});
