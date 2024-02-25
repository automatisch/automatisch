import { describe, it, expect, beforeEach } from 'vitest';
import { createStep } from '../../test/factories/step';
import stepSerializer from './step';

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
});
