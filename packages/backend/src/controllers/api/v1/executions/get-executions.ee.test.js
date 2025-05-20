import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import app from '../../../../app.js';
import { createApiToken } from '../../../../../test/factories/api-token.js';
import { createExecution } from '../../../../../test/factories/execution.js';
import { createFlow } from '../../../../../test/factories/flow.js';
import { createStep } from '../../../../../test/factories/step.js';
import { createUser } from '../../../../../test/factories/user.js';
import getExecutionsMock from '../../../../../test/mocks/rest/api/v1/executions/get-executions.js';
import * as license from '../../../../helpers/license.ee.js';

describe('GET /api/v1/executions', () => {
  let userOne, userTwo, token;

  beforeEach(async () => {
    vi.spyOn(license, 'hasValidLicense').mockResolvedValue(true);

    userOne = await createUser();
    userTwo = await createUser();

    token = (await createApiToken()).token;
  });

  it('should return executions', async () => {
    // Create a flow with steps and executions for userOne
    const userOneFlow = await createFlow({
      userId: userOne.id,
    });

    const userOneFlowStepOne = await createStep({
      flowId: userOneFlow.id,
      type: 'trigger',
    });

    const userOneFlowStepTwo = await createStep({
      flowId: userOneFlow.id,
      type: 'action',
    });

    const userOneExecutionOne = await createExecution({
      flowId: userOneFlow.id,
    });

    const userOneExecutionTwo = await createExecution({
      flowId: userOneFlow.id,
    });

    userOneFlow.steps = [userOneFlowStepOne, userOneFlowStepTwo];
    userOneExecutionOne.flow = userOneFlow;
    userOneExecutionTwo.flow = userOneFlow;

    await userOneExecutionTwo
      .$query()
      .patchAndFetch({ deletedAt: new Date().toISOString() });

    // Create a flow with steps and executions for userTwo
    const userTwoFlow = await createFlow({
      userId: userTwo.id,
    });

    const userTwoFlowStepOne = await createStep({
      flowId: userTwoFlow.id,
      type: 'trigger',
    });

    const userTwoFlowStepTwo = await createStep({
      flowId: userTwoFlow.id,
      type: 'action',
    });

    const userTwoExecutionOne = await createExecution({
      flowId: userTwoFlow.id,
    });

    const userTwoExecutionTwo = await createExecution({
      flowId: userTwoFlow.id,
    });

    userTwoFlow.steps = [userTwoFlowStepOne, userTwoFlowStepTwo];
    userTwoExecutionOne.flow = userTwoFlow;
    userTwoExecutionTwo.flow = userTwoFlow;

    await userTwoExecutionTwo
      .$query()
      .patchAndFetch({ deletedAt: new Date().toISOString() });

    const response = await request(app)
      .get('/api/v1/executions')
      .set('x-api-token', token)
      .expect(200);

    const expectedPayload = await getExecutionsMock([
      userTwoExecutionTwo,
      userTwoExecutionOne,
      userOneExecutionTwo,
      userOneExecutionOne,
    ]);

    expect(response.body).toStrictEqual(expectedPayload);
  });
});
