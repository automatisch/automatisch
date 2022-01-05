import Base from './base';
import Flow from './flow';
import Connection from './connection';

enum StepEnumType {
  'trigger',
  'action',
}

class Step extends Base {
  id!: number
  flowId!: number
  key: string
  appKey: string
  type!: StepEnumType
  connectionId!: number
  parameters: any

  static tableName = 'steps';

  static jsonSchema = {
    type: 'object',
    required: ['type'],

    properties: {
      id: { type: 'integer' },
      flowId: { type: 'integer' },
      key: { type: 'string', minLength: 1, maxLength: 255 },
      appKey: { type: 'string', minLength: 1, maxLength: 255 },
      type: { type: "string", enum: ["action", "trigger"] },
      connectionId: { type: 'integer' },
      parameters: { type: 'object' },
    }
  }

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
        to: 'connections.id'
      },
    }
  })
}

export default Step;
