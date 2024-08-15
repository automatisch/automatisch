import { describe, it, expect, beforeEach } from 'vitest';
import { createStep } from '../../test/factories/step';
import { createExecutionStep } from '../../test/factories/execution-step';
import stepSerializer from './step';
import executionStepSerializer from './execution-step';

describe('stepSerializer', () => {
  let step;

  beforeEach(async () => {
    step = await createStep();
  });

  it('should return step data', async () => {
    const expectedPayload = {
      id: step.id,
      type: step.type,
      key: step.key,
      appKey: step.appKey,
      iconUrl: step.iconUrl,
      webhookUrl: step.webhookUrl,
      status: step.status,
      position: step.position,
      parameters: step.parameters,
    };

    expect(stepSerializer(step)).toEqual(expectedPayload);
  });

  it('should return step data with the execution steps', async () => {
    const executionStepOne = await createExecutionStep({ stepId: step.id });
    const executionStepTwo = await createExecutionStep({ stepId: step.id });

    step.executionSteps = [executionStepOne, executionStepTwo];

    const expectedPayload = {
      executionSteps: [
        executionStepSerializer(executionStepOne),
        executionStepSerializer(executionStepTwo),
      ],
    };

    expect(stepSerializer(step)).toMatchObject(expectedPayload);
  });
});
