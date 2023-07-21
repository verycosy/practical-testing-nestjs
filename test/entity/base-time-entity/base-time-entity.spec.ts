import { TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, Entity } from 'typeorm';
import { BaseTimeEntity } from 'src/entity/base-time-entity';
import { ChronoUnit } from '@js-joda/core';
import { TestUtil } from '../../util/test-util';
import { BaseRepository } from 'src/entity/base.repository';
import { createInMemoryTest } from 'test/util/create-in-memory-test';
import { DBModule } from 'src/db.module';
import { CustomRepository } from 'src/entity/decorators/custom-repository.decorator';

@Entity()
class TestEntity extends BaseTimeEntity {}

@CustomRepository(TestEntity)
class TestRepository extends BaseRepository<TestEntity> {}

describe('BaseTimeEntity 동작 확인', () => {
  let testRepository: TestRepository;
  let module: TestingModule;

  beforeAll(async () => {
    module = await createInMemoryTest({
      imports: [
        DBModule.forRoot({
          useInMemoryDB: true,
          customRepositories: [TestRepository],
        }),
        TypeOrmModule.forFeature([TestEntity]),
      ],
    }).compile();

    testRepository = module.get(TestRepository);
  });

  afterEach(async () => {
    await testRepository.clear();
  });

  afterAll(async () => {
    await module.get(DataSource).destroy();
  });

  // TODO: createdAt, deletedAt
  describe('updatedAt은', () => {
    it('save 메서드로 갱신된다', async () => {
      // given
      const sample = new TestEntity();
      await testRepository.save(sample);

      // when
      await TestUtil.sleep(100);
      const { createdAt, updatedAt, deletedAt } = await testRepository.save(
        sample,
      );

      // then
      expect(createdAt.until(updatedAt, ChronoUnit.MILLIS) >= 100).toBe(true);
      expect(deletedAt).toBeNull();
    });

    it('update 메서드에 인스턴스를 인수로 넘겼을 때 갱신된다', async () => {
      // given
      const sample = new TestEntity();
      const saved = await testRepository.save(sample);

      // when
      await TestUtil.sleep(100);
      await testRepository.update({ id: saved.id }, saved);
      const [{ createdAt, updatedAt, deletedAt }] = await testRepository.find();

      // then
      expect(createdAt.until(updatedAt, ChronoUnit.MILLIS) >= 100).toBe(true);
      expect(deletedAt).toBeNull();
    });
  });
});
