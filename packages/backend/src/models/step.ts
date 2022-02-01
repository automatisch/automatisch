import Base from './base';
import Flow from './flow';
import Connection from './connection';

enum StepEnumType {
  'trigger',
  'action',
}

class Step extends Base {
  id!: number;
  flowId!: number;
  key: string;
  appKey: string;
  type!: StepEnumType;
  connectionId: string;
  position: number;
  parameters: string;
  connection?: Connection;
  flow?: Flow;

  static tableName = 'steps';

  static jsonSchema = {
    type: 'object',
    required: ['type'],

    properties: {
      id: { type: 'integer' },
      flowId: { type: 'integer' },
      key: { type: ['string', null] },
      appKey: { type: ['string', null], minLength: 1, maxLength: 255 },
      type: { type: 'string', enum: ['action', 'trigger'] },
      connectionId: { type: ['string', null] },
      position: { type: 'integer' },
      parameters: { type: ['string', null] },
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
  });
}

export default Step;
