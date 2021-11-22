import Base from './base';
import Flow from './flow';

enum StepEnumType {
  'trigger',
  'action',
}

class Step extends Base {
  id!: number
  flowId!: number
  key!: string
  appKey!: string
  type!: StepEnumType
  connectionId!: number
  parameters: any

  static tableName = 'steps';

  static jsonSchema = {
    type: 'object',
    required: ['key', 'appKey', 'type', 'connectionId'],

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
        from: 'step.flow_id',
        to: 'flows.id',
      },
    }
  })
}

export default Step;
