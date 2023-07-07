import { FindOperator, ValueTransformer } from 'typeorm';

export const createValueTransformer = (
  fn: ValueTransformer,
): ValueTransformer => {
  return {
    to: (entityValue: any) => {
      if (entityValue instanceof FindOperator) {
        // NOTE: And 함수가 FindOperator로 사용되면 transform이 정상적으로 수행되지 않아서
        // 이렇게 별도로 처리해줘야 한다
        const { type, value, useParameter, multipleParameters } = entityValue;
        const transformedValue = Array.isArray(value)
          ? value.map((v) => fn.to(v))
          : fn.to(value);

        return new FindOperator(
          type,
          transformedValue,
          useParameter,
          multipleParameters,
        );
      }

      return fn.to(entityValue);
    },
    from: fn.from,
  };
};
