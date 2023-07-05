import { FindOperator, ValueTransformer } from 'typeorm';

export const createValueTransformer = (
  fn: ValueTransformer,
): ValueTransformer => {
  return {
    to: (entityValue: any) => {
      if (entityValue instanceof FindOperator) {
        return entityValue;
      }

      return fn.to(entityValue);
    },
    from: fn.from,
  };
};
