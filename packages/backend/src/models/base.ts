import { Model, snakeCaseMappers } from 'objection';
import type { QueryContext, ModelOptions, ColumnNameMappers } from 'objection';

class Base extends Model {
  createdAt!: string;
  updatedAt!: string;

  static get columnNameMappers(): ColumnNameMappers {
    return snakeCaseMappers();
  }

  async $beforeInsert(queryContext: QueryContext): Promise<void> {
    await super.$beforeInsert(queryContext);

    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  async $beforeUpdate(opt: ModelOptions, queryContext: QueryContext): Promise<void> {
    await super.$beforeUpdate(opt, queryContext);

    this.updatedAt = new Date().toISOString();
  }
}

export default Base;
