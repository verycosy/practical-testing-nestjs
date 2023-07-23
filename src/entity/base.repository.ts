import { ObjectLiteral, Repository, SelectQueryBuilder } from 'typeorm';

export class BaseRepository<
  Entity extends ObjectLiteral,
> extends Repository<Entity> {
  protected async toPaginate(
    queryBuilder: SelectQueryBuilder<Entity>,
    options: Pageable<Entity, keyof Entity>,
  ) {
    const { sort, take, skip } = options;

    sort.forEach((sortOption) => {
      const { columnName, order, nulls } = sortOption;
      queryBuilder.addOrderBy(columnName as string, order, nulls);
    });

    return await queryBuilder.skip(skip).take(take).getManyAndCount();
  }
}

type SortableColumn<T, K extends keyof T> = keyof Pick<T, K>;
type SortOption<T, K extends keyof T> = {
  columnName: SortableColumn<T, K>;
  order?: 'ASC' | 'DESC';
  nulls?: 'NULLS FIRST' | 'NULLS LAST';
};

export interface Pageable<T, K extends keyof T> {
  sort: SortOption<T, K>[];
  take: number;
  skip: number;
}
