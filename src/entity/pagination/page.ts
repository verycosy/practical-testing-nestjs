export interface Page<T> {
  readonly pageSize: number;
  readonly totalCount: number;
  readonly totalPage: number;
  readonly items: T[];
}
