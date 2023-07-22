import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { ValidationOptions, registerDecorator } from 'class-validator';
import { ClassEnum } from 'src/entity/transformers/class-enum.transformer';

const TransformClassEnum = (clazz: ClassEnum) => {
  const handle = (value: any) => clazz.find(value) ?? value;

  return Transform(
    ({ value }) => (Array.isArray(value) ? value.map(handle) : handle(value)),
    {
      toClassOnly: true,
    },
  );
};

const ValidateClassEnum = (
  clazz: ClassEnum,
  options?: ValidationOptions,
): PropertyDecorator => {
  return function (target: object, propertyKey: string | symbol) {
    registerDecorator({
      name: 'isClassEnum',
      target: target.constructor,
      propertyName: propertyKey as string,
      constraints: [clazz],
      options,
      validator: {
        validate: (value: any) => value instanceof clazz,
        defaultMessage: (args) => {
          const invalidInputs = Array.isArray(args?.value)
            ? args?.value.filter((v) => !(v instanceof clazz))
            : [args?.value];

          return `${invalidInputs?.join(', ')}는 유효하지 않은 값입니다.`;
        },
      },
    });
  };
};

export const IsClassEnum = (
  clazz: Omit<ClassEnum, 'new'>,
  options?: ValidationOptions,
) =>
  applyDecorators(
    TransformClassEnum(clazz as ClassEnum),
    ValidateClassEnum(clazz as ClassEnum, options),
  );
