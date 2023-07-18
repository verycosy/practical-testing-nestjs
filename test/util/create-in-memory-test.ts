import { ModuleMetadata } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { CoreModule } from 'src/core.module';

export const createInMemoryTest = (metadata: ModuleMetadata) => {
  const { imports = [], providers, controllers, exports } = metadata;

  return Test.createTestingModule({
    imports: [CoreModule.forRoot({ useInMemoryDB: true }), ...imports],
    providers,
    controllers,
    exports,
  });
};
