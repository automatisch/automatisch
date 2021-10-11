import { Model, QueryContext, ModelOptions, snakeCaseMappers, ColumnNameMappers } from 'objection';

class Base extends Model {
  createdAt!: string;
  updatedAt!: string;

  static get columnNameMappers(): ColumnNameMappers {
    return snakeCaseMappers();
  }

  async $beforeInsert(queryContext: QueryContext) {
    await super.$beforeInsert(queryContext);

    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  async $beforeUpdate(opt: ModelOptions, queryContext: QueryContext) {
    await super.$beforeUpdate(opt, queryContext);

    this.updatedAt = new Date().toISOString();
  }
}

export default Base;
