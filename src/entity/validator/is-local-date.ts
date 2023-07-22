import { LocalDate, DateTimeParseException } from '@js-joda/core';
import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { ValidationOptions, registerDecorator } from 'class-validator';
import { DateTimeUtil } from 'src/util/date-time-util';

const TransformLocalDate = () => {
  const handle = (str: string) => {
    try {
      return DateTimeUtil.toLocalDateBy(str);
    } catch (err) {
      if (err instanceof DateTimeParseException) {
        return str;
      }

      throw err;
    }
  };

  return Transform(
    ({ value }) => {
      return Array.isArray(value) ? value.map(handle) : handle(value);
    },
    {
      toClassOnly: true,
    },
  );
};

const ValidateLocalDate = (options?: ValidationOptions): PropertyDecorator => {
  return function (target: object, propertyKey: string | symbol) {
    registerDecorator({
      name: 'isLocalDate',
      target: target.constructor,
      propertyName: propertyKey as string,
      options,
      validator: {
        validate: (value: any) => value instanceof LocalDate,
        defaultMessage: (args) => {
          const invalidInputs = Array.isArray(args?.value)
            ? args?.value.filter((v) => !(v instanceof LocalDate))
            : [args?.value];

          return `${invalidInputs?.join(', ')}는 유효하지 않은 값입니다.`;
        },
      },
    });
  };
};

export const IsLocalDate = (options?: ValidationOptions) =>
  applyDecorators(TransformLocalDate(), ValidateLocalDate(options));
