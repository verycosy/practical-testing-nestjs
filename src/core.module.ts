import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DBModule, DBModuleOptions } from './db.module';

@Module({})
export class CoreModule {
  static forRoot(
    options: CoreModuleOptions = { useInMemoryDB: false },
  ): DynamicModule {
    return {
      module: CoreModule,
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        DBModule.forRoot(options),
      ],
    };
  }
}

interface CoreModuleOptions extends DBModuleOptions {}
