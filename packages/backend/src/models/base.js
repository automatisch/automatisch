import { AjvValidator, Model, snakeCaseMappers } from 'objection';
import addFormats from 'ajv-formats';

import ExtendedQueryBuilder from './query-builder.js';

class Base extends Model {
  static QueryBuilder = ExtendedQueryBuilder;

  static get columnNameMappers() {
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

  async $beforeInsert(queryContext) {
    await super.$beforeInsert(queryContext);

    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  async $beforeUpdate(opts, queryContext) {
    this.updatedAt = new Date().toISOString();

    await super.$beforeUpdate(opts, queryContext);
  }
}

export default Base;
