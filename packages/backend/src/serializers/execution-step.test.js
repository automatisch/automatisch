import { describe, it, expect, beforeEach } from 'vitest';
import executionStepSerializer from '@/serializers/execution-step.js';
import stepSerializer from '@/serializers/step.js';
import { createExecutionStep } from '@/factories/execution-step.js';
import { createStep } from '@/factories/step.js';

describe('executionStepSerializer', () => {
  let executionStep, step;

  beforeEach(async () => {
    step = await createStep();

    executionStep = await createExecutionStep({
      stepId: step.id,
    });
  });

  it('should return the execution step data', async () => {
    const expectedPayload = {
      id: executionStep.id,
      dataIn: executionStep.dataIn,
      dataOut: executionStep.dataOut,
      errorDetails: executionStep.errorDetails,
      status: executionStep.status,
      createdAt: executionStep.createdAt.getTime(),
      updatedAt: executionStep.updatedAt.getTime(),
    };

    expect(executionStepSerializer(executionStep)).toStrictEqual(
      expectedPayload
    );
  });

  it('should return the execution step data with the step', async () => {
    executionStep.step = step;

    const expectedPayload = {
      step: stepSerializer(step),
    };

    expect(executionStepSerializer(executionStep)).toMatchObject(
      expectedPayload
    );
  });
});
