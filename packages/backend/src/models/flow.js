import { ValidationError } from 'objection';
import Base from './base.js';
import Step from './step.js';
import User from './user.js';
import Execution from './execution.js';
import Telemetry from '../helpers/telemetry/index.js';

class Flow extends Base {
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
      publishedAt: { type: 'string' },
      deletedAt: { type: 'string' },
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' },
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
      filter(builder) {
        builder.orderBy('position', 'asc');
      },
    },
    triggerStep: {
      relation: Base.HasOneRelation,
      modelClass: Step,
      join: {
        from: 'flows.id',
        to: 'steps.flow_id',
      },
      filter(builder) {
        builder.where('type', 'trigger').limit(1).first();
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
    lastExecution: {
      relation: Base.HasOneRelation,
      modelClass: Execution,
      join: {
        from: 'flows.id',
        to: 'executions.flow_id',
      },
      filter(builder) {
        builder.orderBy('created_at', 'desc').limit(1).first();
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

  static async afterFind(args) {
    const { result } = args;

    const referenceFlow = result[0];

    if (referenceFlow) {
      const shouldBePaused = await referenceFlow.isPaused();

      for (const flow of result) {
        if (!flow.active) {
          flow.status = 'draft';
        } else if (flow.active && shouldBePaused) {
          flow.status = 'paused';
        } else {
          flow.status = 'published';
        }
      }
    }
  }

  async lastInternalId() {
    const lastExecution = await this.$relatedQuery('lastExecution');

    return lastExecution ? lastExecution.internalId : null;
  }

  async lastInternalIds(itemCount = 50) {
    const lastExecutions = await this.$relatedQuery('executions')
      .select('internal_id')
      .orderBy('created_at', 'desc')
      .limit(itemCount);

    return lastExecutions.map((execution) => execution.internalId);
  }

  get IncompleteStepsError() {
    return new ValidationError({
      message: 'All steps should be completed before updating flow status!',
      type: 'incompleteStepsError',
    });
  }

  async $beforeUpdate(opt, queryContext) {
    await super.$beforeUpdate(opt, queryContext);

    if (!this.active) return;

    const oldFlow = opt.old;

    const incompleteStep = await oldFlow.$relatedQuery('steps').findOne({
      status: 'incomplete',
    });

    if (incompleteStep) {
      throw this.IncompleteStepsError;
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

  async $afterInsert(queryContext) {
    await super.$afterInsert(queryContext);
    Telemetry.flowCreated(this);
  }

  async $afterUpdate(opt, queryContext) {
    await super.$afterUpdate(opt, queryContext);
    Telemetry.flowUpdated(this);
  }

  async getTriggerStep() {
    return await this.$relatedQuery('steps').findOne({
      type: 'trigger',
    });
  }

  async isPaused() {
    const user = await this.$relatedQuery('user').withSoftDeleted();
    const allowedToRunFlows = await user.isAllowedToRunFlows();
    return allowedToRunFlows ? false : true;
  }
}

export default Flow;
