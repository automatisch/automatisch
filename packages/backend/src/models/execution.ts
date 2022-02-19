import Base from './base';
import Flow from './flow';

class Execution extends Base {
  id!: string;
  flowId!: number;
  testRun: boolean;

  static tableName = 'executions';

  static jsonSchema = {
    type: 'object',

    properties: {
      id: { type: 'string' },
      flowId: { type: 'integer' },
      testRun: { type: 'boolean' },
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
  });
}

export default Execution;
