import { TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  And,
  Between,
  DataSource,
  Entity,
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
import { CustomRepository } from 'src/entity/decorators/custom-repository.decorator';
import { BaseRepository } from 'src/entity/base.repository';
import { LocalDateTimeColumn } from 'src/entity/columns/local-date-time.column';
import { BaseTimeEntity } from 'src/entity/base-time-entity';

@Entity()
export class LocalDateTimeEntity extends BaseTimeEntity {
  @LocalDateTimeColumn({
    nullable: true,
  })
  checkedAt: LocalDateTime | null;

  constructor(checkedAt?: LocalDateTime) {
    super();

    this.checkedAt = checkedAt ?? null;
  }
}

@CustomRepository(LocalDateTimeEntity)
export class LocalDateTimeColumnRepository extends BaseRepository<LocalDateTimeEntity> {}

describe('LocalDateTimeColumnRepository', () => {
  let repository: LocalDateTimeColumnRepository;
  let module: TestingModule;

  beforeAll(async () => {
    module = await createInMemoryTest({
      imports: [
        DBModule.forRoot({
          useInMemoryDB: true,
          customRepositories: [LocalDateTimeColumnRepository],
        }),
        TypeOrmModule.forFeature([LocalDateTimeEntity]),
      ],
    }).compile();

    repository = module.get(LocalDateTimeColumnRepository);
  });

  afterEach(async () => {
    await repository.clear();
  });

  afterAll(async () => {
    await module.get(DataSource).destroy();
  });

  it('Entity<->DB', async () => {
    // given
    const entity = new LocalDateTimeEntity();

    // when
    const result = await repository.save(entity);

    // then
    expect(result.checkedAt).toBeNull();
    expect(result.createdAt).toBeInstanceOf(LocalDateTime);
    expect(result.updatedAt).toBeInstanceOf(LocalDateTime);
    expect(result.deletedAt).toBeNull();
  });

  describe('find 메서드와 FindOperator', () => {
    it('equal', async () => {
      // given
      await createFixture(repository);

      // when
      const result = await repository.find({
        where: {
          checkedAt: Equal(LocalDateTime.of(2023, 7, 5, 0, 0, 0)),
        },
      });

      // then
      expect(result).toHaveLength(1);
    });

    it('more than equal', async () => {
      // given
      await createFixture(repository);

      // when
      const result = await repository.find({
        where: {
          checkedAt: MoreThanOrEqual(LocalDateTime.of(2023, 7, 5, 0, 0, 0)),
        },
      });

      // then
      expect(result).toHaveLength(3);
    });

    it('between', async () => {
      // given
      await createFixture(repository);

      // when
      const result = await repository.find({
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
      await createFixture(repository);

      // when
      const result = await repository.find({
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
      await createFixture(repository);

      // when
      const result = await repository.find({
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
      await createFixture(repository);

      // when
      const result = await repository.find({
        where: {
          checkedAt: IsNull(),
        },
      });

      // then
      expect(result).toHaveLength(1);
    });

    it('not null', async () => {
      // given
      await createFixture(repository);

      // when
      const result = await repository.find({
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
    // NOTE: 이건 사실상 내부적으로는 Equal(checkedAt)을 넣은 것과 같아서, FindOperator를 쓴 것과 다름 없다
    it('equal', async () => {
      // given
      await createFixture(repository);
      const checkedAt = LocalDateTime.of(2023, 7, 5, 0, 0, 0);

      // when
      const result = await repository
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
      await createFixture(repository);

      // when
      const result = await repository
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
      await createFixture(repository);
      const from = DateTimeUtil.toDate(LocalDateTime.of(2023, 7, 5, 0, 0, 0));
      const to = DateTimeUtil.toDate(LocalDateTime.of(2023, 7, 5, 23, 59, 59));

      // when
      const result = await repository
        .createQueryBuilder('entity')
        .where(`entity.checked_at BETWEEN :from AND :to`, {
          from,
          to,
        })
        .getMany();

      // then
      expect(result).toHaveLength(2);
    });
  });
});

const createFixture = async (repository: LocalDateTimeColumnRepository) => {
  const sample1 = new LocalDateTimeEntity(
    LocalDateTime.of(2023, 7, 4, 23, 59, 59),
  );
  const sample2 = new LocalDateTimeEntity(
    LocalDateTime.of(2023, 7, 5, 0, 0, 0),
  );
  const sample3 = new LocalDateTimeEntity(
    LocalDateTime.of(2023, 7, 5, 23, 59, 59),
  );
  const sample4 = new LocalDateTimeEntity(
    LocalDateTime.of(2023, 7, 6, 0, 0, 0),
  );
  const sample5 = new LocalDateTimeEntity();
  await repository.save([sample1, sample2, sample3, sample4, sample5]);
};
