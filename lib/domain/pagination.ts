export type Pagination = {
  limit: number;
  offset: number;
};

export type Page<T> = Pagination & {
  items: T[];
  total: number;
  hasMore: boolean;
};

export function createPage<T>(
  items: T[],
  total: number,
  pagination: Pagination
): Page<T> {
  return {
    items,
    total,
    ...pagination,
    hasMore: pagination.offset + items.length < total,
  };
}
