import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import {
  DataSource,
  DataSourceOptions,
  EntityTarget,
  ObjectLiteral,
} from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { newDb } from 'pg-mem';
import { join } from 'path';
import { ProductRepository } from './entity/domain/product/product.repository';
import { OrderRepository } from './entity/domain/order/order.repository';
import { StockRepository } from './entity/domain/stock/stock.repository';
import { MailSendHistoryRepository } from './entity/domain/history/mail/mail-send-history.repository';
import {
  addTransactionalDataSource,
  deleteDataSourceByName,
  initializeTransactionalContext,
} from 'typeorm-transactional';
import { BaseRepository } from './entity/base.repository';
import { CUSTOM_REPOSITORY_TOKEN } from './entity/decorators/custom-repository.decorator';

type NODE_ENV = 'test' | 'local' | 'production';
interface TestEnvOption {
  isTestEnv: boolean;
}

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (
        configService: ConfigService,
      ): TypeOrmModuleOptions & TestEnvOption => {
        const env = configService.get('NODE_ENV') as NODE_ENV;
        const isTestEnv = env === 'test';

        return {
          type: 'postgres',
          port: Number(configService.get<string>('DB_PORT')),
          host: configService.get<string>('DB_HOST'),
          username: configService.get<string>('DB_USERNAME'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_NAME'),
          autoLoadEntities: true,
          entitySkipConstructor: true,
          namingStrategy: new SnakeNamingStrategy(),
          dropSchema: false,
          logging: true,
          synchronize: isTestEnv,
          entities: [join(__dirname, '/**/*.entity{.ts,.js}')],
          isTestEnv,
        };
      },
      dataSourceFactory: async (
        options?: DataSourceOptions & Partial<TestEnvOption>,
      ) => {
        if (!options) {
          throw new Error('Empty DataSourceOptions');
        }

        const { isTestEnv, ...rest } = options;

        const dataSource = isTestEnv
          ? DBModule.createInMemoryDataSource(rest)
          : new DataSource(rest);

        deleteDataSourceByName('default');
        addTransactionalDataSource(dataSource);

        return await dataSource.initialize();
      },
    }),
  ],
})
export class DBModule {
  private static createInMemoryDataSource(options: DataSourceOptions) {
    const db = newDb();
    db.public
      .registerFunction({
        name: 'version',
        implementation: () => 'version',
      })
      .registerFunction({
        name: 'current_database',
        implementation: () => 'current_database',
      });

    return db.adapters.createTypeormDataSource(options);
  }

  static forRoot(): DynamicModule {
    initializeTransactionalContext();

    const customRepositories: (typeof BaseRepository<ObjectLiteral>)[] = [
      ProductRepository,
      OrderRepository,
      StockRepository,
      MailSendHistoryRepository,
    ];

    const providers: Provider[] = [];
    customRepositories.forEach((customRepository) => {
      const entity: EntityTarget<ObjectLiteral> = Reflect.getMetadata(
        CUSTOM_REPOSITORY_TOKEN,
        customRepository,
      );

      providers.push({
        inject: [DataSource],
        provide: customRepository,
        useFactory: (dataSource: DataSource) => {
          const { target, manager, queryRunner } =
            dataSource.getRepository(entity);
          return new customRepository(target, manager, queryRunner);
        },
      });
    });

    return {
      module: DBModule,
      providers,
      exports: providers,
    };
  }
}
