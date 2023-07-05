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
import { ChronoUnit, LocalDateTime } from '@js-joda/core';
import { TestUtil } from '../test-util';
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

  it('Entity<->DB LocalDateTimeColumn 변환', async () => {
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

  it('updatedAt는 save 메서드로 갱신된다', async () => {
    // given
    const sample = new Sample({
      text: 'hello',
    });

    // when
    const result1 = await sampleRepository.save(sample);
    await TestUtil.sleep(2000);
    const result2 = await sampleRepository.save(result1);

    // then
    expect(result2.checkedAt).toBeNull();
    expect(
      result2.createdAt.until(result2.updatedAt, ChronoUnit.SECONDS) >= 2,
    ).toBe(true);
    expect(result2.deletedAt).toBeNull();
  });

  it('updatedAt은 update 메서드에 인스턴스를 인자로 사용했을 때는 갱신된다', async () => {
    // given
    const sample = new Sample({
      text: 'hello',
    });

    // when
    const saved = await sampleRepository.save(sample);
    await TestUtil.sleep(2000);

    await sampleRepository.update({ id: saved.id }, saved); // NOTE: partialEntity 파라미터에 인스턴스가 아닌 json을 넣으면 당연히 @BeforeUpdate 동작X
    const [result] = await sampleRepository.find();

    // then
    expect(result.checkedAt).toBeNull();
    expect(
      result.createdAt.until(result.updatedAt, ChronoUnit.SECONDS) >= 2,
    ).toBe(true);
    expect(result.deletedAt).toBeNull();
  });

  it('find 메서드와 FindOperator로 LocalDateTimeColumn 조회', async () => {
    // given
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
    await sampleRepository.save([sample1, sample2, sample3, sample4, sample5]);

    // when
    const equalResults = await sampleRepository.find({
      where: {
        checkedAt: Equal(LocalDateTime.of(2023, 7, 5, 0, 0, 0)),
      },
    });
    const betweenResults = await sampleRepository.find({
      where: {
        checkedAt: Between(
          LocalDateTime.of(2023, 7, 5, 0, 0, 0),
          LocalDateTime.of(2023, 7, 5, 23, 59, 59),
        ),
      },
    });
    const notBetweenResults = await sampleRepository.find({
      where: {
        checkedAt: Not(
          Between(
            LocalDateTime.of(2023, 7, 5, 0, 0, 0),
            LocalDateTime.of(2023, 7, 5, 23, 59, 59),
          ),
        ),
      },
    });
    const andResults = await sampleRepository.find({
      where: {
        checkedAt: And(
          MoreThanOrEqual(LocalDateTime.of(2023, 7, 5, 0, 0, 0)),
          LessThanOrEqual(LocalDateTime.of(2023, 7, 5, 23, 59, 59)),
        ),
      },
    });
    const nullResults = await sampleRepository.find({
      where: {
        checkedAt: IsNull(),
      },
    });
    const notNullResults = await sampleRepository.find({
      where: {
        checkedAt: Not(IsNull()),
      },
    });

    // then
    expect(equalResults).toHaveLength(1);
    expect(betweenResults).toHaveLength(2);
    expect(notBetweenResults).toHaveLength(2);
    expect(andResults).toHaveLength(2);
    expect(nullResults).toHaveLength(1);
    expect(notNullResults).toHaveLength(4);
  });

  it('QueryBuilder로 LocalDateTimeColumn 조회', async () => {
    // given
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
    await sampleRepository.save([sample1, sample2, sample3, sample4, sample5]);

    // when
    const equalResults = await sampleRepository
      .createQueryBuilder()
      .where({
        checkedAt: LocalDateTime.of(2023, 7, 5, 0, 0, 0),
      })
      .getMany();
    const betweenResults = await sampleRepository
      .createQueryBuilder()
      .where({
        checkedAt: Between(
          LocalDateTime.of(2023, 7, 5, 0, 0, 0),
          LocalDateTime.of(2023, 7, 5, 23, 59, 59),
        ),
      })
      .getMany();
    const betweenWithParamterResults = await sampleRepository
      .createQueryBuilder('sample')
      .where(`sample.checked_at BETWEEN :from AND :to`, {
        from: LocalDateTime.of(2023, 7, 5, 0, 0, 0),
        to: LocalDateTime.of(2023, 7, 5, 23, 59, 59),
      })
      .getMany();

    // then
    expect(equalResults).toHaveLength(1);
    expect(betweenResults).toHaveLength(2);
    expect(betweenWithParamterResults).toHaveLength(2);
  });
});
