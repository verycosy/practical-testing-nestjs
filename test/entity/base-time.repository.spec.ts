import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, Entity } from 'typeorm';
import { BaseTimeEntity } from 'src/entity/base-time-entity';
import { ChronoUnit } from '@js-joda/core';
import { Injectable } from '@nestjs/common';
import { TestUtil } from '../util/test-util';
import { CoreModule } from 'src/core.module';
import { BaseRepository } from 'src/entity/base.repository';

@Entity()
class TestEntity extends BaseTimeEntity {}

@Injectable()
class TestRepository extends BaseRepository<TestEntity> {}

describe('BaseTimeEntity 동작 확인', () => {
  let testRepository: TestRepository;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [CoreModule, TypeOrmModule.forFeature([TestEntity])],
      providers: [
        {
          inject: [DataSource],
          provide: TestRepository,
          useFactory: (dataSource: DataSource) =>
            new TestRepository(TestEntity, dataSource.createEntityManager()),
        },
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

      // when
      await testRepository.save(sample);
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

      // when
      const saved = await testRepository.save(sample);

      await TestUtil.sleep(100);
      await testRepository.update({ id: saved.id }, saved); // NOTE: partialEntity 파라미터에 인스턴스가 아닌 json을 넣으면 당연히 @BeforeUpdate 동작X
      const [{ createdAt, updatedAt, deletedAt }] = await testRepository.find();

      // then
      expect(createdAt.until(updatedAt, ChronoUnit.MILLIS) >= 100).toBe(true);
      expect(deletedAt).toBeNull();
    });
  });
});
