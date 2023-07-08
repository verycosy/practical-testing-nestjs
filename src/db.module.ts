import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { newDb } from 'pg-mem';
import { join } from 'path';
import { ProductRepository } from './entity/domain/product/product.repository';
import { StockRepository } from './entity/domain/stock/stock.repository';
import { MailSendHistoryRepository } from './entity/domain/history/mail/mail-send-history.repository';

type NODE_ENV = 'test' | 'local' | 'production';
interface TestEnvOption {
  isTestEnv: boolean;
}

const repositories = [
  ProductRepository,
  StockRepository,
  MailSendHistoryRepository,
];

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
      dataSourceFactory: async ({
        isTestEnv,
        ...options
      }: DataSourceOptions & TestEnvOption) => {
        const dataSource = isTestEnv
          ? await DBModule.createInMemoryDataSource(options)
          : new DataSource(options);

        return await dataSource.initialize();
      },
    }),
  ],
  providers: repositories,
  exports: repositories,
})
export class DBModule {
  private static async createInMemoryDataSource(options: DataSourceOptions) {
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

    return await db.adapters.createTypeormDataSource(options);
  }
}
