import { SetMetadata } from '@nestjs/common';
import { EntityTarget, ObjectLiteral } from 'typeorm';

export const CUSTOM_REPOSITORY_TOKEN = 'CUSTOM_REPOSITORY';

export const CustomRepository = (
  entity: EntityTarget<ObjectLiteral>,
): ClassDecorator => {
  return SetMetadata(CUSTOM_REPOSITORY_TOKEN, entity);
};
