import type { QueryContext } from 'objection';
import Base from './base';
import Execution from './execution';
import Step from './step';
import Telemetry from '../helpers/telemetry';
import { IJSONObject } from '@automatisch/types';

class ExecutionStep extends Base {
  id!: string;
  executionId!: string;
  stepId!: string;
  dataIn!: IJSONObject;
  dataOut!: IJSONObject;
  errorDetails: IJSONObject;
  status = 'failure';
  step: Step;

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

  async $afterInsert(queryContext: QueryContext) {
    await super.$afterInsert(queryContext);
    Telemetry.executionStepCreated(this);
  }
}

export default ExecutionStep;
