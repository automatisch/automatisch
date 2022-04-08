import Base from './base';
import Flow from './flow';
import Connection from './connection';
import ExecutionStep from './execution-step';
import type { IStep } from '@automatisch/types';

class Step extends Base {
  id!: string;
  flowId!: string;
  key?: string;
  appKey?: string;
  type!: IStep["type"];
  connectionId?: string;
  status = 'incomplete';
  position!: number;
  parameters: Record<string, unknown> = {};
  connection?: Connection;
  flow: Flow;
  executionSteps?: [ExecutionStep];

  static tableName = 'steps';

  static jsonSchema = {
    type: 'object',
    required: ['type'],

    properties: {
      id: { type: 'string', format: 'uuid' },
      flowId: { type: 'string', format: 'uuid' },
      key: { type: ['string', 'null'] },
      appKey: { type: ['string', 'null'], minLength: 1, maxLength: 255 },
      type: { type: 'string', enum: ['action', 'trigger'] },
      connectionId: { type: ['string', 'null'], format: 'uuid' },
      status: { type: 'string', enum: ['incomplete', 'completed'] },
      position: { type: 'integer' },
      parameters: { type: 'object' },
    },
  };

  static relationMappings = () => ({
    flow: {
      relation: Base.BelongsToOneRelation,
      modelClass: Flow,
      join: {
        from: 'steps.flow_id',
        to: 'flows.id',
      },
    },
    connection: {
      relation: Base.HasOneRelation,
      modelClass: Connection,
      join: {
        from: 'steps.connection_id',
        to: 'connections.id',
      },
    },
    executionSteps: {
      relation: Base.HasManyRelation,
      modelClass: ExecutionStep,
      join: {
        from: 'steps.id',
        to: 'execution_steps.step_id',
      },
    },
  });
}

export default Step;
