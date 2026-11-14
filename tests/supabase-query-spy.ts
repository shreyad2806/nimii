type QueryResult = {
  data: unknown;
  error: null;
  count?: number;
};

export type QueryCall = {
  table: string;
  filters: Array<[string, unknown]>;
  orders: Array<{ column: string; ascending: boolean }>;
  range?: [number, number];
};

type QuerySpyOptions = {
  singleData?: (call: QueryCall) => unknown;
  listData?: (call: QueryCall) => unknown[];
  count?: number;
};

export class SupabaseQuerySpy {
  readonly call: QueryCall;

  constructor(
    table: string,
    private readonly options: QuerySpyOptions = {}
  ) {
    this.call = { table, filters: [], orders: [] };
  }

  select() {
    return this;
  }

  eq(column: string, value: unknown) {
    this.call.filters.push([column, value]);
    return this;
  }

  order(column: string, options: { ascending: boolean }) {
    this.call.orders.push({ column, ascending: options.ascending });
    return this;
  }

  range(from: number, to: number) {
    this.call.range = [from, to];
    return this;
  }

  maybeSingle() {
    return Promise.resolve({
      data: this.options.singleData?.(this.call) ?? null,
      error: null,
    });
  }

  then(
    onfulfilled?: (value: QueryResult) => unknown,
    onrejected?: (reason: unknown) => unknown
  ) {
    return Promise.resolve({
      data: this.options.listData?.(this.call) ?? [],
      error: null,
      count: this.options.count ?? 0,
    }).then(onfulfilled, onrejected);
  }
}
