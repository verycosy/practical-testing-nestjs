import { applyDecorators } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiResponse,
  ApiResponseMetadata,
  ApiResponseSchemaHost,
  getSchemaPath,
} from '@nestjs/swagger';
import {
  ReferenceObject,
  SchemaObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { HttpResponse } from 'src/api/http.response';

type Model = Required<ApiResponseMetadata>['type'];
type ApiHttpResponseOptions = ApiResponseMetadata & {
  type: Model;
};

export const ApiHttpResponse = ({
  type,
  ...options
}: ApiHttpResponseOptions) => {
  const decorators: MethodDecorator[] = [];
  const item: SchemaObject | ReferenceObject = {};
  const dataSchema: SchemaObject | ReferenceObject = {
    nullable: true,
  };
  const schema: ApiResponseSchemaHost['schema'] = {
    allOf: [
      {
        $ref: getSchemaPath(HttpResponse),
      },
      {
        properties: {
          data: dataSchema,
        },
      },
    ],
  };

  const isArray = Array.isArray(type) || options.isArray;
  const model = Array.isArray(type) ? type[0] : type;

  const isPrimitiveType =
    typeof model === 'string' ||
    model === String ||
    model === Number ||
    model === Boolean;

  if (isPrimitiveType) {
    const primitiveTypeString =
      typeof model === 'string' ? model : model.name.toLowerCase();

    Object.assign(item, { type: primitiveTypeString });
  } else {
    const modelRef = getSchemaPath(model);
    Object.assign(item, { $ref: modelRef });

    decorators.push(ApiExtraModels(model));
  }

  Object.assign(dataSchema, isArray ? { type: 'array', items: item } : item);

  decorators.push(
    ApiResponse({
      ...options,
      schema,
    }),
  );

  return applyDecorators(...decorators);
};
