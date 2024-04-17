import { describe, it, expect, beforeEach } from 'vitest';
import { createFlow } from '../../test/factories/flow';
import flowSerializer from './flow';
import stepSerializer from './step';
import { createStep } from '../../test/factories/step';

describe('flowSerializer', () => {
  let flow, stepOne, stepTwo;

  beforeEach(async () => {
    flow = await createFlow();

    stepOne = await createStep({
      flowId: flow.id,
      type: 'trigger',
    });

    stepTwo = await createStep({
      flowId: flow.id,
      type: 'action',
    });
  });

  it('should return flow data', async () => {
    const expectedPayload = {
      id: flow.id,
      name: flow.name,
      active: flow.active,
      status: flow.status,
      createdAt: flow.createdAt.getTime(),
      updatedAt: flow.updatedAt.getTime(),
    };

    expect(flowSerializer(flow)).toEqual(expectedPayload);
  });

  it('should return flow data with the steps', async () => {
    flow.steps = [stepOne, stepTwo];

    const expectedPayload = {
      steps: [stepSerializer(stepOne), stepSerializer(stepTwo)],
    };

    expect(flowSerializer(flow)).toMatchObject(expectedPayload);
  });
});
