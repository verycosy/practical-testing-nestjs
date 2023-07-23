import { ObjectLiteral, Repository, SelectQueryBuilder } from 'typeorm';
import { Pageable } from './pagination/pageable';

export class BaseRepository<
  Entity extends ObjectLiteral,
> extends Repository<Entity> {
  protected async toPaginate(
    queryBuilder: SelectQueryBuilder<Entity>,
    options: Pageable<Entity, keyof Entity>,
  ) {
    const { sort, pageNo, pageSize } = options;

    sort.forEach((sortOption) => {
      const { columnName, order, nulls } = sortOption;
      queryBuilder.addOrderBy(columnName as string, order, nulls);
    });

    return await queryBuilder
      .skip((pageNo - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();
  }
}
