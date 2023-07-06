import { IStaticEnum } from 'ts-jenum';
import { createValueTransformer } from './create-value-transformer';
import { CodeName } from '../code-name';

export type ClassEnum = Omit<IStaticEnum<CodeName>, 'new'>;

export const ClassEnumTransformer = (clazz: ClassEnum) =>
  createValueTransformer({
    to(entityValue: ReturnType<IStaticEnum<CodeName>['valueOf']> | null) {
      if (entityValue) {
        return entityValue.code;
      }

      return null;
    },
    from(databaseValue: string | null) {
      if (databaseValue) {
        return clazz.valueOf(databaseValue);
      }

      return null;
    },
  });
