import { ValidationError } from 'objection';
import type { ModelOptions, QueryContext } from 'objection';
import ExtendedQueryBuilder from './query-builder';
import Base from './base';
import Step from './step';
import Execution from './execution';
import Telemetry from '../helpers/telemetry';

class Flow extends Base {
  id!: string;
  name!: string;
  userId!: string;
  active: boolean;
  steps?: [Step];
  published_at: string;

  static tableName = 'flows';

  static jsonSchema = {
    type: 'object',
    required: ['name'],

    properties: {
      id: { type: 'string', format: 'uuid' },
      name: { type: 'string', minLength: 1 },
      userId: { type: 'string', format: 'uuid' },
      active: { type: 'boolean' },
    },
  };

  static relationMappings = () => ({
    steps: {
      relation: Base.HasManyRelation,
      modelClass: Step,
      join: {
        from: 'flows.id',
        to: 'steps.flow_id',
      },
      filter(builder: ExtendedQueryBuilder<Step>) {
        builder.orderBy('position', 'asc');
      },
    },
    executions: {
      relation: Base.HasManyRelation,
      modelClass: Execution,
      join: {
        from: 'flows.id',
        to: 'executions.flow_id',
      },
    },
  });

  async lastInternalId() {
    const lastExecution = await this.$relatedQuery('executions')
      .orderBy('created_at', 'desc')
      .first();

    return lastExecution ? (lastExecution as Execution).internalId : null;
  }

  async $beforeUpdate(
    opt: ModelOptions,
    queryContext: QueryContext
  ): Promise<void> {
    await super.$beforeUpdate(opt, queryContext);

    if (!this.active) return;

    const oldFlow = opt.old as Flow;

    const incompleteStep = await oldFlow.$relatedQuery('steps').findOne({
      status: 'incomplete',
    });

    if (incompleteStep) {
      throw new ValidationError({
        message: 'All steps should be completed before updating flow status!',
        type: 'incompleteStepsError',
      });
    }

    const allSteps = await oldFlow.$relatedQuery('steps');

    if (allSteps.length < 2) {
      throw new ValidationError({
        message:
          'There should be at least one trigger and one action steps in the flow!',
        type: 'insufficientStepsError',
      });
    }

    return;
  }

  async $afterInsert(queryContext: QueryContext) {
    await super.$afterInsert(queryContext);
    Telemetry.flowCreated(this);
  }

  async $afterUpdate(opt: ModelOptions, queryContext: QueryContext) {
    await super.$afterUpdate(opt, queryContext);
    Telemetry.flowUpdated(this);
  }

  async getTriggerStep(): Promise<Step> {
    return await this.$relatedQuery('steps').findOne({
      type: 'trigger',
    });
  }
}

export default Flow;
