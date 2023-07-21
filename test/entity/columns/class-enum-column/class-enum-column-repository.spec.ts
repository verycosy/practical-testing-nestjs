import { TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { And, DataSource, Entity, Equal, In, IsNull, Not } from 'typeorm';
import { BaseIdEntity } from 'src/entity/base-id-entity';
import { ClassEnumColumn } from 'src/entity/columns/class-enum.column';
import { TestStatus } from './test-status';
import { CustomRepository } from 'src/entity/decorators/custom-repository.decorator';
import { BaseRepository } from 'src/entity/base.repository';
import { createInMemoryTest } from 'test/util/create-in-memory-test';
import { DBModule } from 'src/db.module';

@Entity()
class ClassEnumColumnEntity extends BaseIdEntity {
  constructor(status: TestStatus) {
    super();

    this.status = status;
  }

  @ClassEnumColumn(TestStatus)
  status: TestStatus;
}

@CustomRepository(ClassEnumColumnEntity)
class ClassEnumColumnRepository extends BaseRepository<ClassEnumColumnEntity> {}

describe('ClassEnumColumnRepository', () => {
  let repository: ClassEnumColumnRepository;
  let module: TestingModule;

  beforeAll(async () => {
    module = await createInMemoryTest({
      imports: [
        DBModule.forRoot({
          useInMemoryDB: true,
          customRepositories: [ClassEnumColumnRepository],
        }),
        TypeOrmModule.forFeature([ClassEnumColumnEntity]),
      ],
    }).compile();

    repository = module.get(ClassEnumColumnRepository);
  });

  afterEach(async () => {
    await repository.clear();
  });

  afterAll(async () => {
    await module.get(DataSource).destroy();
  });

  it('Entity<->DB', async () => {
    // given / when
    const sample = new ClassEnumColumnEntity(TestStatus.DONE);
    const result = await repository.save(sample);

    // then
    expect(result.status).toBe(TestStatus.DONE);
  });

  describe('find 메서드로 조회', () => {
    it('equal', async () => {
      // given
      await createFixture(repository);

      // when
      const result = await repository.find({
        where: {
          status: TestStatus.READY,
        },
      });

      // then
      expect(result).toHaveLength(1);
    });

    it('or', async () => {
      // given
      await createFixture(repository);

      // when
      const result = await repository.find({
        where: [
          {
            status: TestStatus.READY,
          },
          {
            status: TestStatus.PROGRESS,
          },
        ],
      });

      // then
      expect(result).toHaveLength(3);
    });

    it('in', async () => {
      // given
      await createFixture(repository);

      // when
      const result = await repository.find({
        where: {
          status: In([TestStatus.READY, TestStatus.DONE]),
        },
      });

      // then
      expect(result).toHaveLength(4);
    });

    it('not', async () => {
      // given
      await createFixture(repository);

      // when
      const result = await repository.find({
        where: {
          status: Not(TestStatus.DONE),
        },
      });

      // then
      expect(result).toHaveLength(3);
    });

    it('not and', async () => {
      // given
      await createFixture(repository);

      // when
      const result = await repository.find({
        where: {
          status: And(Not(TestStatus.READY), Equal(TestStatus.PROGRESS)),
        },
      });

      // then
      expect(result).toHaveLength(2);
    });

    it('not is null', async () => {
      // given
      await createFixture(repository);

      // when
      const notIsNullResults = await repository.find({
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
      await createFixture(repository);

      // when
      const result = await repository
        .createQueryBuilder('sample')
        .where({
          status: TestStatus.READY,
        })
        .getMany();

      // then
      expect(result).toHaveLength(1);
    });

    it('in', async () => {
      // given
      await createFixture(repository);

      // when
      const result = await repository
        .createQueryBuilder('sample')
        .where([
          {
            status: In([TestStatus.READY, TestStatus.PROGRESS]),
          },
        ])
        .getMany();

      // then
      expect(result).toHaveLength(3);
    });

    it('or', async () => {
      // given
      await createFixture(repository);

      // when
      const result1 = await repository
        .createQueryBuilder('sample')
        .where([
          {
            status: TestStatus.READY,
          },
          {
            status: TestStatus.PROGRESS,
          },
        ])
        .getMany();

      const result2 = await repository
        .createQueryBuilder('sample')
        .where(`(sample.status = :status1 OR sample.status = :status2)`, {
          status1: TestStatus.READY.code,
          status2: TestStatus.PROGRESS.code,
        })
        .getMany();

      // getsql도 심지어 같은 동작

      // then
      expect(result1).toHaveLength(3);
      expect(result2).toHaveLength(3);
    });
  });
});

const createFixture = async (repository: ClassEnumColumnRepository) => {
  const sample1 = new ClassEnumColumnEntity(TestStatus.READY);
  const sample2 = new ClassEnumColumnEntity(TestStatus.PROGRESS);
  const sample3 = new ClassEnumColumnEntity(TestStatus.PROGRESS);
  const sample4 = new ClassEnumColumnEntity(TestStatus.DONE);
  const sample5 = new ClassEnumColumnEntity(TestStatus.DONE);
  const sample6 = new ClassEnumColumnEntity(TestStatus.DONE);
  const samples = [sample1, sample2, sample3, sample4, sample5, sample6];
  await repository.save(samples);
};
