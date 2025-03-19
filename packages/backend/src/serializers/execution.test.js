import { describe, it, expect, beforeEach } from 'vitest';
import executionSerializer from './execution';
import flowSerializer from './flow';
import { createExecution } from '../../test/factories/execution';
import { createFlow } from '../../test/factories/flow';

describe('executionSerializer', () => {
  let flow, execution;

  beforeEach(async () => {
    flow = await createFlow();

    execution = await createExecution({
      flowId: flow.id,
    });
  });

  it('should return the execution data', async () => {
    const expectedPayload = {
      id: execution.id,
      testRun: execution.testRun,
      status: execution.status,
      createdAt: execution.createdAt.getTime(),
      updatedAt: execution.updatedAt.getTime(),
    };

    expect(executionSerializer(execution)).toStrictEqual(expectedPayload);
  });

  it('should return the execution data with the flow', async () => {
    execution.flow = flow;

    const expectedPayload = {
      flow: flowSerializer(flow),
    };

    expect(executionSerializer(execution)).toMatchObject(expectedPayload);
  });
});
