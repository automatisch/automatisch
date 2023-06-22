import {
  Model,
  Page,
  PartialModelObject,
  ForClassMethod,
  AnyQueryBuilder,
} from 'objection';

const DELETED_COLUMN_NAME = 'deleted_at';

const buildQueryBuidlerForClass = (): ForClassMethod => {
  return (modelClass) => {
    const qb: AnyQueryBuilder = Model.QueryBuilder.forClass.call(
      ExtendedQueryBuilder,
      modelClass
    );
    qb.onBuild((builder) => {
      if (!builder.context().withSoftDeleted && qb.modelClass().jsonSchema.properties.deletedAt) {
        builder.whereNull(
          `${qb.modelClass().tableName}.${DELETED_COLUMN_NAME}`
        );
      }
    });
    return qb;
  };
};

class ExtendedQueryBuilder<M extends Model, R = M[]> extends Model.QueryBuilder<
  M,
  R
> {
  ArrayQueryBuilderType!: ExtendedQueryBuilder<M, M[]>;
  SingleQueryBuilderType!: ExtendedQueryBuilder<M, M>;
  MaybeSingleQueryBuilderType!: ExtendedQueryBuilder<M, M | undefined>;
  NumberQueryBuilderType!: ExtendedQueryBuilder<M, number>;
  PageQueryBuilderType!: ExtendedQueryBuilder<M, Page<M>>;

  static forClass: ForClassMethod = buildQueryBuidlerForClass();

  delete() {
    return this.patch({
      [DELETED_COLUMN_NAME]: new Date().toISOString(),
    } as unknown as PartialModelObject<M>);
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
    } as unknown as PartialModelObject<M>);
  }
}

export default ExtendedQueryBuilder;
