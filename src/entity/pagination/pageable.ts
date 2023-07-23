type SortableColumn<T, K extends keyof T> = keyof Pick<T, K>;
type SortOption<T, K extends keyof T> = {
  columnName: SortableColumn<T, K>;
  order?: 'ASC' | 'DESC';
  nulls?: 'NULLS FIRST' | 'NULLS LAST';
};

export interface Pageable<T, K extends keyof T> {
  sort: SortOption<T, K>[];
  pageSize: number;
  pageNo: number;
}
