import Base from './base';
import Execution from './execution';

class ExecutionStep extends Base {
  id!: string;
  executionId!: number;
  stepId!: number;
  dataIn!: any;
  dataOut!: any;
  status: string;

  static tableName = 'execution_steps';

  static jsonSchema = {
    type: 'object',

    properties: {
      id: { type: 'string' },
      executionId: { type: 'integer' },
      stepId: { type: 'integer' },
      dataIn: { type: 'object' },
      dataOut: { type: 'object' },
      status: { type: 'string', enum: ['success', 'failure'] },
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
  });
}

export default ExecutionStep;
