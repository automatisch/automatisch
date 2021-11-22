import Base from './base'
import Step from './step'

class Flow extends Base {
  id!: number
  userId!: number

  static tableName = 'flows';

  static jsonSchema = {
    type: 'object',

    properties: {
      id: { type: 'integer' },
      userId: { type: 'integer' }
    }
  }

  static relationMappings = () => ({
    steps: {
      relation: Base.HasManyRelation,
      modelClass: Step,
      join: {
        from: 'flows.id',
        to: 'steps.flow_id',
      },
    }
  })
}

export default Flow;
