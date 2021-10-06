import { Model, QueryContext, ModelOptions } from 'objection';

class Base extends Model {
  created_at!: string;
  updated_at!: string;

  async $beforeInsert(queryContext: QueryContext) {
    await super.$beforeInsert(queryContext);

    this.created_at = new Date().toISOString();
    this.updated_at = new Date().toISOString();
  }

  async $beforeUpdate(opt: ModelOptions, queryContext: QueryContext) {
    await super.$beforeUpdate(opt, queryContext);

    this.updated_at = new Date().toISOString();
  }
}

export default Base;
