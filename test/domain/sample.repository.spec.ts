import { Test, TestingModule } from '@nestjs/testing';
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
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

describe('SampleRepository', () => {
  let sampleRepository: SampleRepository;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'test',
          password: 'test',
          database: 'test',
          entities: [Sample],
          synchronize: true,
          dropSchema: true,
          logging: true,
          entitySkipConstructor: true,
          namingStrategy: new SnakeNamingStrategy(),
        }),
      ],
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

    it('equal', async () => {
      // given
      await createFixture();

      // when
      const result = await sampleRepository
        .createQueryBuilder()
        .where({
          checkedAt: LocalDateTime.of(2023, 7, 5, 0, 0, 0),
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

      // when
      const result = await sampleRepository
        .createQueryBuilder('sample')
        .where(`sample.checked_at BETWEEN :from AND :to`, {
          from: LocalDateTime.of(2023, 7, 5, 0, 0, 0),
          to: LocalDateTime.of(2023, 7, 5, 23, 59, 59),
        })
        .getMany();

      // then
      expect(result).toHaveLength(2);
    });
  });
});
