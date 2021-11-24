import { Model, snakeCaseMappers } from 'objection';
import type { Constructor, TransactionOrKnex, QueryBuilderType, QueryContext, ModelOptions, ColumnNameMappers } from 'objection';

class Base extends Model {
  createdAt!: string;
  updatedAt!: string;

  static get columnNameMappers(): ColumnNameMappers {
    return snakeCaseMappers();
  }

  static query<M extends Model>(
    this: Constructor<M>,
    trxOrKnex?: TransactionOrKnex
  ): QueryBuilderType<M> {
    return super.query(trxOrKnex).throwIfNotFound() as QueryBuilderType<M>;
  };

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
