import { ValidationError } from 'objection';
import type { ModelOptions } from 'objection';
import Base from './base';
import Step from './step';
import Execution from './execution';

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
      id: { type: 'string', format: 'uuid' },
      name: { type: 'string' },
      userId: { type: 'string', format: 'uuid' },
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
    executions: {
      relation: Base.HasManyRelation,
      modelClass: Execution,
      join: {
        from: 'flows.id',
        to: 'executions.flow_id',
      },
    },
  });

  async $beforeUpdate(opt: ModelOptions): Promise<void> {
    if (!this.active) return;

    const oldFlow = opt.old as Flow;

    const incompleteStep = await oldFlow.$relatedQuery('steps').findOne({
      status: 'incomplete',
    });

    if (incompleteStep) {
      throw new ValidationError({
        message: 'All steps should be completed before updating flow status!',
        type: 'incompleteStepsError',
      });
    }

    const allSteps = await oldFlow.$relatedQuery('steps');

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
