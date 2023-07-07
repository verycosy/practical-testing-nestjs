import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { newDb } from 'pg-mem';
import { join } from 'path';

type NODE_ENV = 'test' | 'local' | 'production';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const env = configService.get('NODE_ENV') as NODE_ENV;

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
          synchronize: env === 'test',
          entities: [join(__dirname, '/**/*.entity{.ts,.js}')],
        };
      },
      dataSourceFactory: async (options: DataSourceOptions) => {
        const isTestEnv = options.synchronize;
        const dataSource = isTestEnv
          ? await DBModule.createInMemoryDataSource(options)
          : new DataSource(options);

        return await dataSource.initialize();
      },
    }),
  ],
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
