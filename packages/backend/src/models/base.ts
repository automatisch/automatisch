import { AjvValidator, Model, snakeCaseMappers } from 'objection';
import type { QueryContext, ModelOptions, ColumnNameMappers } from 'objection';
import addFormats from 'ajv-formats';

class Base extends Model {
  createdAt!: string;
  updatedAt!: string;

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

  async $beforeUpdate(opt: ModelOptions, queryContext: QueryContext): Promise<void> {
    await super.$beforeUpdate(opt, queryContext);

    this.updatedAt = new Date().toISOString();
  }
}

export default Base;
