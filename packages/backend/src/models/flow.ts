import { ValidationError } from 'objection';
import type { ModelOptions, QueryContext } from 'objection';
import appConfig from '../config/app';
import ExtendedQueryBuilder from './query-builder';
import Base from './base';
import Step from './step';
import User from './user';
import Execution from './execution';
import Telemetry from '../helpers/telemetry';

class Flow extends Base {
  id!: string;
  name!: string;
  userId!: string;
  active: boolean;
  steps: Step[];
  published_at: string;
  remoteWebhookId: string;
  executions?: Execution[];
  user?: User;

  static tableName = 'flows';

  static jsonSchema = {
    type: 'object',
    required: ['name'],

    properties: {
      id: { type: 'string', format: 'uuid' },
      name: { type: 'string', minLength: 1 },
      userId: { type: 'string', format: 'uuid' },
      remoteWebhookId: { type: 'string' },
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
    user: {
      relation: Base.HasOneRelation,
      modelClass: User,
      join: {
        from: 'flows.user_id',
        to: 'users.id',
      },
    },
  });

  async lastInternalId() {
    const lastExecution = await this.$relatedQuery('executions')
      .orderBy('created_at', 'desc')
      .first();

    return lastExecution ? (lastExecution as Execution).internalId : null;
  }

  async lastInternalIds(itemCount = 50) {
    const lastExecutions = await this.$relatedQuery('executions')
      .select('internal_id')
      .orderBy('created_at', 'desc')
      .limit(itemCount);

    return lastExecutions.map((execution) => execution.internalId);
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

  async checkIfQuotaExceeded() {
    if (!appConfig.isCloud) return;

    const user = await this.$relatedQuery('user');
    const usageData = await user.$relatedQuery('usageData');

    const hasExceeded = await usageData.checkIfLimitExceeded();

    if (hasExceeded) {
      return true;
    }

    return false;
  }

  async throwIfQuotaExceeded() {
    if (!appConfig.isCloud) return;

    const hasExceeded = await this.checkIfQuotaExceeded();

    if (hasExceeded) {
      throw new Error('The allowed task quota has been exhausted!');
    }

    return this;
  }
}

export default Flow;
