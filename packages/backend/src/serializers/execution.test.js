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
      createdAt: execution.createdAt.getTime(),
      updatedAt: execution.updatedAt.getTime(),
    };

    expect(executionSerializer(execution)).toEqual(expectedPayload);
  });

  it('should return the execution data with status', async () => {
    execution.status = 'success';

    const expectedPayload = {
      id: execution.id,
      testRun: execution.testRun,
      createdAt: execution.createdAt.getTime(),
      updatedAt: execution.updatedAt.getTime(),
      status: 'success',
    };

    expect(executionSerializer(execution)).toEqual(expectedPayload);
  });

  it('should return the execution data with the flow', async () => {
    execution.flow = flow;

    const expectedPayload = {
      flow: flowSerializer(flow),
    };

    expect(executionSerializer(execution)).toMatchObject(expectedPayload);
  });
});
