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

    expect(flowSerializer(flow)).toStrictEqual(expectedPayload);
  });

  it('should return flow data with the steps', async () => {
    flow.steps = [stepOne, stepTwo];

    const expectedPayload = {
      steps: [stepSerializer(stepOne), stepSerializer(stepTwo)],
    };

    expect(flowSerializer(flow)).toMatchObject(expectedPayload);
  });

  describe('isOwner', () => {
    it('should not be defined by default', async () => {
      expect(flowSerializer(flow)).not.toHaveProperty('isOwner');
    });

    it('should return true if the flow is owned by the current user', async () => {
      flow.isOwner = true;

      expect(flowSerializer(flow)).toMatchObject({ isOwner: true });
    });

    it('should return false if the flow is owned by another user', async () => {
      flow.isOwner = false;

      expect(flowSerializer(flow)).toMatchObject({ isOwner: false });
    });
  });
});
