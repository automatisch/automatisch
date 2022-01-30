import Base from './base';
import Step from './step';

class Flow extends Base {
  id!: number;
  name: string;
  userId!: number;
  active: boolean;
  steps?: [Step];

  static tableName = 'flows';

  static jsonSchema = {
    type: 'object',

    properties: {
      id: { type: 'integer' },
      name: { type: 'string' },
      userId: { type: 'integer' },
      active: { type: 'boolean' },
    },
  };

  static relationMappings = () => ({
    steps: {
      relation: Base.HasManyRelation,
      modelClass: Step,
      join: {
        from: 'flows.id',
        to: 'steps.flow_id',
      },
    },
  });
}

export default Flow;
