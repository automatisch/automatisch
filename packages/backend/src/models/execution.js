import Base from './base.js';
import Flow from './flow.js';
import ExecutionStep from './execution-step.js';
import Telemetry from '../helpers/telemetry/index.js';

class Execution extends Base {
  static tableName = 'executions';

  static jsonSchema = {
    type: 'object',

    properties: {
      id: { type: 'string', format: 'uuid' },
      flowId: { type: 'string', format: 'uuid' },
      testRun: { type: 'boolean', default: false },
      internalId: { type: 'string' },
      deletedAt: { type: 'string' },
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' },
    },
  };

  static relationMappings = () => ({
    flow: {
      relation: Base.BelongsToOneRelation,
      modelClass: Flow,
      join: {
        from: 'executions.flow_id',
        to: 'flows.id',
      },
    },
    executionSteps: {
      relation: Base.HasManyRelation,
      modelClass: ExecutionStep,
      join: {
        from: 'executions.id',
        to: 'execution_steps.execution_id',
      },
    },
  });

  async $afterInsert(queryContext) {
    await super.$afterInsert(queryContext);
    Telemetry.executionCreated(this);
  }
}

export default Execution;
