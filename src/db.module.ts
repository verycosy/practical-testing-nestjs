import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  DataSource,
  DataSourceOptions,
  EntityTarget,
  ObjectLiteral,
} from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { newDb } from 'pg-mem';
import { join } from 'path';
import {
  addTransactionalDataSource,
  deleteDataSourceByName,
  initializeTransactionalContext,
} from 'typeorm-transactional';
import { BaseRepository } from './entity/base.repository';
import { CUSTOM_REPOSITORY_TOKEN } from './entity/decorators/custom-repository.decorator';
import { getTransactionalContext } from 'typeorm-transactional/dist/common';

type CustomRepository = typeof BaseRepository<ObjectLiteral>;

@Global()
@Module({})
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

  private static getCustomRepositoryProviders(
    customRepositories: CustomRepository[],
  ): Provider[] {
    return customRepositories.map((customRepository) => {
      const entity: EntityTarget<ObjectLiteral> = Reflect.getMetadata(
        CUSTOM_REPOSITORY_TOKEN,
        customRepository,
      );

      return {
        inject: [DataSource],
        provide: customRepository,
        useFactory: (dataSource: DataSource) => {
          const { target, manager, queryRunner } =
            dataSource.getRepository(entity);
          return new customRepository(target, manager, queryRunner);
        },
      };
    });
  }

  static forRoot(
    options: DBModuleOptions = { useInMemoryDB: false, customRepositories: [] },
  ): DynamicModule {
    const { useInMemoryDB, customRepositories } = options;

    if (!getTransactionalContext()) {
      initializeTransactionalContext();
    }

    const providers = DBModule.getCustomRepositoryProviders(customRepositories);

    return {
      module: DBModule,
      imports: [
        TypeOrmModule.forRootAsync({
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => {
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
              synchronize: useInMemoryDB,
              entities: [join(__dirname, '/**/*.entity{.ts,.js}')],
            };
          },
          dataSourceFactory: async (options) => {
            if (!options) {
              throw new Error('Empty DataSourceOptions');
            }

            const dataSource = useInMemoryDB
              ? DBModule.createInMemoryDataSource(options)
              : new DataSource(options);

            deleteDataSourceByName('default');
            addTransactionalDataSource(dataSource);

            return await dataSource.initialize();
          },
        }),
      ],
      providers,
      exports: providers,
    };
  }
}

export interface DBModuleOptions {
  useInMemoryDB: boolean;
  customRepositories: CustomRepository[];
}
