import type { QueryContext } from 'objection';
import { IJSONObject } from '@automatisch/types';
import appConfig from '../config/app';
import Base from './base';
import Execution from './execution';
import Step from './step';
import Telemetry from '../helpers/telemetry';

class ExecutionStep extends Base {
  id!: string;
  executionId!: string;
  stepId!: string;
  dataIn!: IJSONObject;
  dataOut!: IJSONObject;
  errorDetails: IJSONObject;
  status: 'success' | 'failure';
  step: Step;
  execution?: Execution;
  count?: number;

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

  async $afterInsert(queryContext: QueryContext) {
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
