import Base from './base'

enum StepEnumType {
  'trigger',
  'action',
}

class Step extends Base {
  id!: number
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
      key: { type: 'string', minLength: 1, maxLength: 255 },
      appKey: { type: 'string', minLength: 1, maxLength: 255 },
      type: { type: "string", enum: ["action", "trigger"] },
      connectionId: { type: 'integer' },
      parameters: { type: 'object' },
    }
  }
}

export default Step;
