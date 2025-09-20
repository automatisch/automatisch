import { Model } from 'objection';

const DELETED_COLUMN_NAME = 'deleted_at';

const supportsSoftDeletion = (modelClass) => {
  return modelClass.jsonSchema.properties.deletedAt;
};

const buildQueryBuilderForClass = () => {
  return (modelClass) => {
    const qb = Model.QueryBuilder.forClass.call(
      ExtendedQueryBuilder,
      modelClass
    );
    qb.onBuild((builder) => {
      if (
        !builder.context().withSoftDeleted &&
        supportsSoftDeletion(qb.modelClass())
      ) {
        builder.whereNull(
          `${qb.modelClass().tableName}.${DELETED_COLUMN_NAME}`
        );
      }
    });
    return qb;
  };
};

class ExtendedQueryBuilder extends Model.QueryBuilder {
  static forClass = buildQueryBuilderForClass();

  delete() {
    if (supportsSoftDeletion(this.modelClass())) {
      return this.patch({
        [DELETED_COLUMN_NAME]: new Date().toISOString(),
      });
    }

    return super.delete();
  }

  hardDelete() {
    return super.delete();
  }

  withSoftDeleted() {
    this.context().withSoftDeleted = true;
    return this;
  }

  restore() {
    return this.patch({
      [DELETED_COLUMN_NAME]: null,
    });
  }

  async updateFirstOrInsert(data = {}) {
    let firstRow = await this.first();

    if (firstRow) {
      return firstRow.$query().patchAndFetch(data);
    }

    const newInstance = this.insertAndFetch(data);

    return newInstance;
  }
}

export default ExtendedQueryBuilder;
