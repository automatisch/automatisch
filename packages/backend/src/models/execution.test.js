import { vi, describe, it, expect, beforeEach } from 'vitest';
import Execution from './execution';
import ExecutionStep from './execution-step';
import Flow from './flow';
import Base from './base';
import Telemetry from '../helpers/telemetry/index';
import { createExecution } from '../../test/factories/execution';
import { createUser } from '../../test/factories/user';
import { createFlow } from '../../test/factories/flow';
import { createStep } from '../../test/factories/step';
import { createPermission } from '../../test/factories/permission';

describe('Execution model', () => {
  it('tableName should return correct name', () => {
    expect(Execution.tableName).toBe('executions');
  });

  it('jsonSchema should have correct validations', () => {
    expect(Execution.jsonSchema).toMatchSnapshot();
  });

  it('relationMappings should return correct associations', () => {
    const relationMappings = Execution.relationMappings();

    const expectedRelations = {
      executionSteps: {
        join: {
          from: 'executions.id',
          to: 'execution_steps.execution_id',
        },
        modelClass: ExecutionStep,
        relation: Base.HasManyRelation,
      },
      flow: {
        join: {
          from: 'executions.flow_id',
          to: 'flows.id',
        },
        modelClass: Flow,
        relation: Base.BelongsToOneRelation,
      },
    };

    expect(relationMappings).toStrictEqual(expectedRelations);
  });

  describe('find', () => {
    let currentUser,
      currentUserRole,
      anotherUser,
      flow,
      executionOne,
      executionTwo,
      executionThree;

    beforeEach(async () => {
      currentUser = await createUser();
      currentUserRole = await currentUser.$relatedQuery('role');

      anotherUser = await createUser();

      flow = await createFlow({
        userId: currentUser.id,
        name: 'Test Flow',
      });

      const anotherUserFlow = await createFlow({
        userId: anotherUser.id,
        name: 'Another User Flow',
      });

      executionOne = await createExecution({
        flowId: flow.id,
        testRun: false,
        status: 'success',
      });

      // sleep for 10 milliseconds to make sure the created_at values are different
      await new Promise((resolve) => setTimeout(resolve, 10));

      executionTwo = await createExecution({
        flowId: flow.id,
        testRun: true,
        status: 'failure',
      });

      // sleep for 10 milliseconds to make sure the created_at values are different
      await new Promise((resolve) => setTimeout(resolve, 10));

      executionThree = await createExecution({
        flowId: anotherUserFlow.id,
        testRun: false,
        status: 'success',
      });

      await createPermission({
        action: 'read',
        subject: 'Execution',
        roleId: currentUserRole.id,
        conditions: [],
      });

      currentUser = await currentUser.$query().withGraphFetched({
        role: true,
        permissions: true,
      });
    });

    it('should return executions filtered by name', async () => {
      const executions = await Execution.find({ name: 'Test Flow' });

      expect(executions).toHaveLength(2);

      expect(executions[0].id).toBe(executionTwo.id);
      expect(executions[1].id).toBe(executionOne.id);
    });

    it('should return executions filtered by success status', async () => {
      const executions = await Execution.find({ status: 'success' });

      expect(executions).toHaveLength(2);

      expect(executions[0].id).toBe(executionThree.id);
      expect(executions[1].id).toBe(executionOne.id);
    });

    it('should return executions filtered by failure status', async () => {
      const executions = await Execution.find({ status: 'failure' });

      expect(executions).toHaveLength(1);
      expect(executions[0].id).toBe(executionTwo.id);
    });

    it('should return executions filtered by startDateTime and endDateTime', async () => {
      const executions = await Execution.find({
        startDateTime: executionOne.createdAt,
        endDateTime: executionTwo.createdAt,
      });

      expect(executions).toHaveLength(2);
      expect(executions[0].id).toBe(executionTwo.id);
      expect(executions[1].id).toBe(executionOne.id);
    });

    it('should return all executions when no filter is applied', async () => {
      const executions = await Execution.find({});

      expect(executions.length).toBeGreaterThanOrEqual(3);

      expect(executions.some((e) => e.id === executionOne.id)).toBe(true);
      expect(executions.some((e) => e.id === executionTwo.id)).toBe(true);
      expect(executions.some((e) => e.id === executionThree.id)).toBe(true);
    });

    it('should include flow and steps in the returned executions', async () => {
      const step = await createStep({
        flowId: flow.id,
        type: 'trigger',
      });

      const executions = await Execution.find({ name: 'Test Flow' });

      expect(executions[0].flow.id).toBe(flow.id);
      expect(executions[0].flow.steps[0].id).toBe(step.id);
    });
  });

  it('$afterInsert should call Telemetry.executionCreated', async () => {
    const telemetryExecutionCreatedSpy = vi
      .spyOn(Telemetry, 'executionCreated')
      .mockImplementation(() => {});

    const execution = await createExecution();

    expect(telemetryExecutionCreatedSpy).toHaveBeenCalledWith(execution);
  });
});
