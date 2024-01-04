import appConfig from '../config/app.js';
import Base from './base.js';
import Execution from './execution.js';
import Step from './step.js';
import Telemetry from '../helpers/telemetry/index.js';

class ExecutionStep extends Base {
  static tableName = 'execution_steps';

  static jsonSchema = {
    type: 'object',

    properties: {
      id: { type: 'string', format: 'uuid' },
      executionId: { type: 'string', format: 'uuid' },
      stepId: { type: 'string' },
      dataIn: { type: ['object', 'null'] },
      dataOut: { type: ['object', 'null'] },
      status: { type: 'string', enum: ['success', 'failure'] },
      errorDetails: { type: ['object', 'null'] },
      deletedAt: { type: 'string' },
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' },
    },
  };

  static relationMappings = () => ({
    execution: {
      relation: Base.BelongsToOneRelation,
      modelClass: Execution,
      join: {
        from: 'execution_steps.execution_id',
        to: 'executions.id',
      },
    },
    step: {
      relation: Base.BelongsToOneRelation,
      modelClass: Step,
      join: {
        from: 'execution_steps.step_id',
        to: 'steps.id',
      },
    },
  });

  get isFailed() {
    return this.status === 'failure';
  }

  async $afterInsert(queryContext) {
    await super.$afterInsert(queryContext);
    Telemetry.executionStepCreated(this);

    if (appConfig.isCloud) {
      const execution = await this.$relatedQuery('execution');

      if (!execution.testRun && !this.isFailed) {
        const flow = await execution.$relatedQuery('flow');
        const user = await flow.$relatedQuery('user');
        const usageData = await user.$relatedQuery('currentUsageData');

        await usageData.increaseConsumedTaskCountByOne();
      }
    }
  }
}

export default ExecutionStep;
