import { TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sample } from './sample.entity';
import { SampleRepository } from './sample.repository';
import {
  And,
  Between,
  DataSource,
  Equal,
  IsNull,
  LessThanOrEqual,
  MoreThanOrEqual,
  Not,
} from 'typeorm';
import { LocalDateTime } from '@js-joda/core';
import { DateTimeUtil } from 'src/util/date-time-util';
import { createInMemoryTest } from 'test/util/create-in-memory-test';
import { DBModule } from 'src/db.module';

describe('SampleRepository', () => {
  let sampleRepository: SampleRepository;
  let module: TestingModule;

  beforeAll(async () => {
    module = await createInMemoryTest({
      imports: [
        DBModule.forRoot({
          useInMemoryDB: true,
          customRepositories: [SampleRepository],
        }),
        TypeOrmModule.forFeature([Sample]),
      ],
    }).compile();

    sampleRepository = module.get(SampleRepository);
  });

  afterEach(async () => {
    await sampleRepository.clear();
  });

  afterAll(async () => {
    await module.get(DataSource).destroy();
  });

  describe('LocalDateTimeColumn', () => {
    it('Entity<->DB', async () => {
      // given
      const sample = new Sample({});

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
        checkedAt: LocalDateTime.of(2023, 7, 4, 23, 59, 59),
      });
      const sample2 = new Sample({
        checkedAt: LocalDateTime.of(2023, 7, 5, 0, 0, 0),
      });
      const sample3 = new Sample({
        checkedAt: LocalDateTime.of(2023, 7, 5, 23, 59, 59),
      });
      const sample4 = new Sample({
        checkedAt: LocalDateTime.of(2023, 7, 6, 0, 0, 0),
      });
      const sample5 = new Sample({});
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
        checkedAt: LocalDateTime.of(2023, 7, 4, 23, 59, 59),
      });
      const sample2 = new Sample({
        checkedAt: LocalDateTime.of(2023, 7, 5, 0, 0, 0),
      });
      const sample3 = new Sample({
        checkedAt: LocalDateTime.of(2023, 7, 5, 23, 59, 59),
      });
      const sample4 = new Sample({
        checkedAt: LocalDateTime.of(2023, 7, 6, 0, 0, 0),
      });
      const sample5 = new Sample({});
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
});
