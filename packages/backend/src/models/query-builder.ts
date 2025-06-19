import {
  Model,
  Page,
  ModelClass,
  PartialModelObject,
  ForClassMethod,
  AnyQueryBuilder,
} from 'objection';

const DELETED_COLUMN_NAME = 'deleted_at';

const supportsSoftDeletion = (modelClass: ModelClass<any>) => {
  return modelClass.jsonSchema.properties.deletedAt;
}

const buildQueryBuidlerForClass = (): ForClassMethod => {
  return (modelClass) => {
    const qb: AnyQueryBuilder = Model.QueryBuilder.forClass.call(
      ExtendedQueryBuilder,
      modelClass
    );
    qb.onBuild((builder) => {
      if (!builder.context().withSoftDeleted && supportsSoftDeletion(qb.modelClass())) {
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
    if (supportsSoftDeletion(this.modelClass())) {
      return this.patch({
        [DELETED_COLUMN_NAME]: new Date().toISOString(),
      } as unknown as PartialModelObject<M>);
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
    } as unknown as PartialModelObject<M>);
  }
}

export default ExtendedQueryBuilder;
