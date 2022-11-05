import { AjvValidator, Model, snakeCaseMappers } from 'objection';
import type { QueryContext, ModelOptions, ColumnNameMappers } from 'objection';
import addFormats from 'ajv-formats';

import ExtendedQueryBuilder from './query-builder';

class Base extends Model {
  createdAt!: string;
  updatedAt!: string;
  deletedAt: string;

  QueryBuilderType!: ExtendedQueryBuilder<this>;
  static QueryBuilder = ExtendedQueryBuilder;

  static get columnNameMappers(): ColumnNameMappers {
    return snakeCaseMappers();
  }

  static createValidator() {
    return new AjvValidator({
      onCreateAjv: (ajv) => {
        addFormats.default(ajv);
      },
      options: {
        allErrors: true,
        validateSchema: true,
        ownProperties: true,
      },
    });
  }

  async $beforeInsert(queryContext: QueryContext): Promise<void> {
    await super.$beforeInsert(queryContext);

    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  async $beforeUpdate(
    opts: ModelOptions,
    queryContext: QueryContext
  ): Promise<void> {
    this.updatedAt = new Date().toISOString();

    await super.$beforeUpdate(opts, queryContext);
  }
}

export default Base;
