import { ValidationError } from 'objection';
import Base from './base';
import Step from './step';

class Flow extends Base {
  id!: string;
  name: string;
  userId!: string;
  active: boolean;
  steps?: [Step];

  static tableName = 'flows';

  static jsonSchema = {
    type: 'object',

    properties: {
      id: { type: 'string' },
      name: { type: 'string' },
      userId: { type: 'string' },
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

  async $beforeUpdate(): Promise<void> {
    if (!this.active) return;

    const incompleteStep = await this.$relatedQuery('steps').findOne({
      status: 'incomplete',
    });

    if (incompleteStep) {
      throw new ValidationError({
        message: 'All steps should be completed before updating flow status!',
        type: 'incompleteStepsError',
      });
    }

    const allSteps = await this.$relatedQuery('steps');

    if (allSteps.length < 2) {
      throw new ValidationError({
        message:
          'There should be at least one trigger and one action steps in the flow!',
        type: 'insufficientStepsError',
      });
    }

    return;
  }
}

export default Flow;
