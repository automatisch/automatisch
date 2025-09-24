import { beforeEach, describe, it, expect, vi } from 'vitest';
import appConfig from '@/config/app.js';
import App from '@/models/app.js';
import Base from '@/models/base.js';
import Step from '@/models/step.js';
import McpTool from '@/models/mcp-tool.ee.js';
import Flow from '@/models/flow.js';
import Connection from '@/models/connection.js';
import ExecutionStep from '@/models/execution-step.js';
import Telemetry from '@/helpers/telemetry/index.js';
import Engine from '@/engine/index.js';
import { createFlow } from '@/factories/flow.js';
import { createUser } from '@/factories/user.js';
import { createRole } from '@/factories/role.js';
import { createPermission } from '@/factories/permission.js';
import { createConnection } from '@/factories/connection.js';
import { createStep } from '@/factories/step.js';
import { createExecutionStep } from '@/factories/execution-step.js';
import { createMcpTool } from '@/factories/mcp-tool';

describe('Step model', () => {
  it('tableName should return correct name', () => {
    expect(Step.tableName).toBe('steps');
  });

  it('jsonSchema should have correct validations', () => {
    expect(Step.jsonSchema).toMatchSnapshot();
  });

  it('virtualAttributes should return correct attributes', () => {
    const virtualAttributes = Step.virtualAttributes;

    const expectedAttributes = ['iconUrl', 'webhookUrl'];

    expect(virtualAttributes).toStrictEqual(expectedAttributes);
  });

  describe('relationMappings', () => {
    it('should return correct associations', () => {
      const relationMappings = Step.relationMappings();

      const expectedRelations = {
        flow: {
          relation: Base.BelongsToOneRelation,
          modelClass: Flow,
          join: {
            from: 'steps.flow_id',
            to: 'flows.id',
          },
        },
        connection: {
          relation: Base.HasOneRelation,
          modelClass: Connection,
          join: {
            from: 'steps.connection_id',
            to: 'connections.id',
          },
        },
        parentStep: {
          relation: Base.BelongsToOneRelation,
          modelClass: Step,
          join: {
            from: 'steps.parent_step_id',
            to: 'steps.id',
          },
        },
        mcpTools: {
          relation: Base.ManyToManyRelation,
          modelClass: McpTool,
          join: {
            from: 'steps.flow_id',
            through: {
              from: 'flows.id',
              to: 'flows.id',
            },
            to: 'mcp_tools.flow_id',
          },
        },
        childrenSteps: {
          relation: Base.HasManyRelation,
          modelClass: Step,
          join: {
            from: 'steps.id',
            to: 'steps.parent_step_id',
          },
        },
        lastExecutionStep: {
          relation: Base.HasOneRelation,
          modelClass: ExecutionStep,
          join: {
            from: 'steps.id',
            to: 'execution_steps.step_id',
          },
          filter: expect.any(Function),
        },
        executionSteps: {
          relation: Base.HasManyRelation,
          modelClass: ExecutionStep,
          join: {
            from: 'steps.id',
            to: 'execution_steps.step_id',
          },
        },
      };

      expect(relationMappings).toStrictEqual(expectedRelations);
    });

    it('lastExecutionStep should return the trigger step', () => {
      const relations = Step.relationMappings();

      const firstSpy = vi.fn();

      const limitSpy = vi.fn().mockImplementation(() => ({
        first: firstSpy,
      }));

      const orderBySpy = vi.fn().mockImplementation(() => ({
        limit: limitSpy,
      }));

      relations.lastExecutionStep.filter({ orderBy: orderBySpy });

      expect(orderBySpy).toHaveBeenCalledWith('created_at', 'desc');
      expect(limitSpy).toHaveBeenCalledWith(1);
      expect(firstSpy).toHaveBeenCalledOnce();
    });
  });

  describe('webhookUrl', () => {
    it('should return it along with appConfig.webhookUrl when exists', () => {
      vi.spyOn(appConfig, 'webhookUrl', 'get').mockReturnValue(
        'https://automatisch.io'
      );

      const step = new Step();
      step.webhookPath = '/webhook-path';

      expect(step.webhookUrl).toBe('https://automatisch.io/webhook-path');
    });

    it('should return null when webhookUrl does not exist', () => {
      const step = new Step();

      expect(step.webhookUrl).toBe(null);
    });
  });

  describe('iconUrl', () => {
    it('should return step app icon absolute URL when app is set', () => {
      vi.spyOn(appConfig, 'baseUrl', 'get').mockReturnValue(
        'https://automatisch.io'
      );

      const step = new Step();
      step.appKey = 'gitlab';

      expect(step.iconUrl).toBe(
        'https://automatisch.io/apps/gitlab/assets/favicon.svg'
      );
    });

    it('should return null when appKey is not set', () => {
      const step = new Step();

      expect(step.iconUrl).toBe(null);
    });
  });

  it('isTrigger should return true when structural type is trigger', () => {
    const step = new Step();
    step.type = 'trigger';

    expect(step.isTrigger).toBe(true);
  });

  it('isAction should return true when structural type is action', () => {
    const step = new Step();
    step.type = 'action';

    expect(step.isAction).toBe(true);
  });

  describe('computeWebhookPath', () => {
    it('should return null if structural type is action', async () => {
      const step = new Step();
      step.type = 'action';

      expect(await step.computeWebhookPath()).toBe(null);
    });

    it('should return null if triggerCommand is not found', async () => {
      const step = new Step();
      step.type = 'trigger';

      vi.spyOn(step, 'getTriggerCommand').mockResolvedValue(null);

      expect(await step.computeWebhookPath()).toBe(null);
    });

    it('should return null if triggerCommand type is not webhook', async () => {
      const step = new Step();
      step.type = 'trigger';

      vi.spyOn(step, 'getTriggerCommand').mockResolvedValue({
        type: 'not-webhook',
      });

      expect(await step.computeWebhookPath()).toBe(null);
    });

    it('should return synchronous webhook path if workSynchronously is true', async () => {
      const step = new Step();
      step.type = 'trigger';
      step.flowId = 'flow-id';
      step.parameters = { workSynchronously: true };

      vi.spyOn(step, 'getTriggerCommand').mockResolvedValue({
        type: 'webhook',
      });

      expect(await step.computeWebhookPath()).toBe(
        '/webhooks/flows/flow-id/sync'
      );
    });

    it('should return asynchronous webhook path if workSynchronously is false', async () => {
      const step = new Step();
      step.type = 'trigger';
      step.flowId = 'flow-id';
      step.parameters = { workSynchronously: false };

      vi.spyOn(step, 'getTriggerCommand').mockResolvedValue({
        type: 'webhook',
      });

      expect(await step.computeWebhookPath()).toBe('/webhooks/flows/flow-id');
    });
  });

  describe('getWebhookUrl', () => {
    it('should return absolute webhook URL when structural type is trigger', async () => {
      const step = new Step();
      step.type = 'trigger';

      vi.spyOn(step, 'computeWebhookPath').mockResolvedValue('/webhook-path');
      vi.spyOn(appConfig, 'webhookUrl', 'get').mockReturnValue(
        'https://automatisch.io'
      );

      expect(await step.getWebhookUrl()).toBe(
        'https://automatisch.io/webhook-path'
      );
    });

    it('should return undefined when structural type is action', async () => {
      const step = new Step();
      step.type = 'action';

      expect(await step.getWebhookUrl()).toBe(undefined);
    });
  });
  describe('getApp', () => {
    it('should return app with the given appKey', async () => {
      const step = new Step();
      step.appKey = 'gitlab';

      const findOneByKeySpy = vi.spyOn(App, 'findOneByKey').mockResolvedValue();

      await step.getApp();
      expect(findOneByKeySpy).toHaveBeenCalledWith('gitlab');
    });

    it('should return null with no appKey', async () => {
      const step = new Step();

      const findOneByKeySpy = vi.spyOn(App, 'findOneByKey').mockResolvedValue();

      expect(await step.getApp()).toBe(null);
      expect(findOneByKeySpy).not.toHaveBeenCalled();
    });
  });

  it('testAndContinue should execute the flow and mark the step as completed', async () => {
    const step = await createStep({ status: 'incomplete' });

    const engineSpy = vi.spyOn(Engine, 'run').mockResolvedValue();

    const updatedStep = await step.testAndContinue();

    expect(engineSpy).toHaveBeenCalledWith({
      untilStepId: step.id,
      testRun: true,
    });

    expect(updatedStep.status).toBe('completed');
  });

  it('continueWithoutTest should mark the step as completed without executing the flow', async () => {
    const step = await createStep({ status: 'incomplete' });
    const updatedStep = await step.continueWithoutTest();

    expect(updatedStep.status).toBe('completed');
  });

  it('getLastExecutionStep should return last execution step', async () => {
    const step = await createStep();
    await createExecutionStep({ stepId: step.id });
    const secondExecutionStep = await createExecutionStep({ stepId: step.id });

    expect(await step.getLastExecutionStep()).toStrictEqual(
      secondExecutionStep
    );
  });

  it('getNextStep should return the next step', async () => {
    const firstStep = await createStep();
    const secondStep = await createStep({ flowId: firstStep.flowId });
    const thirdStep = await createStep({ flowId: firstStep.flowId });

    expect(await secondStep.getNextStep()).toStrictEqual(thirdStep);
  });

  describe('getTriggerCommand', () => {
    it('should return trigger command when app key and key are defined in trigger step', async () => {
      const step = new Step();
      step.type = 'trigger';
      step.appKey = 'webhook';
      step.key = 'catchRawWebhook';

      const findOneByKeySpy = vi.spyOn(App, 'findOneByKey');
      const triggerCommand = await step.getTriggerCommand();

      expect(findOneByKeySpy).toHaveBeenCalledWith(step.appKey);
      expect(triggerCommand.key).toBe(step.key);
    });

    it('should return null when key is not defined', async () => {
      const step = new Step();
      step.type = 'trigger';
      step.appKey = 'webhook';

      expect(await step.getTriggerCommand()).toBe(null);
    });
  });

  describe('getActionCommand', () => {
    it('should return action comamand when app key and key are defined in action step', async () => {
      const step = new Step();
      step.type = 'action';
      step.appKey = 'ntfy';
      step.key = 'sendMessage';

      const findOneByKeySpy = vi.spyOn(App, 'findOneByKey');
      const actionCommand = await step.getActionCommand();

      expect(findOneByKeySpy).toHaveBeenCalledWith(step.appKey);
      expect(actionCommand.key).toBe(step.key);
    });

    it('should return null when key is not defined', async () => {
      const step = new Step();
      step.type = 'action';
      step.appKey = 'ntfy';

      expect(await step.getActionCommand()).toBe(null);
    });
  });

  describe('getSetupFields', () => {
    it('should return trigger setup substep fields in trigger step', async () => {
      const step = new Step();
      step.appKey = 'webhook';
      step.key = 'catchRawWebhook';
      step.type = 'trigger';

      expect(await step.getSetupFields()).toStrictEqual([
        {
          label: 'Wait until flow is done',
          key: 'workSynchronously',
          type: 'dropdown',
          required: true,
          options: [
            { label: 'Yes', value: true },
            { label: 'No', value: false },
          ],
        },
      ]);
    });

    it('should return action setup substep fields in action step', async () => {
      const step = new Step();
      step.appKey = 'datastore';
      step.key = 'getValue';
      step.type = 'action';

      expect(await step.getSetupFields()).toStrictEqual([
        {
          label: 'Key',
          key: 'key',
          type: 'string',
          required: true,
          description: 'The key of your value to get.',
          variables: true,
        },
      ]);
    });
  });

  it.todo('getSetupAndDynamicFields');
  it.todo('createDynamicFields');
  it.todo('createDynamicData');

  describe('updateWebhookUrl', () => {
    it('should do nothing if step is an action', async () => {
      const step = new Step();
      step.type = 'action';

      await step.updateWebhookUrl();

      expect(step.webhookUrl).toBeNull();
    });

    it('should set webhookPath if step is a trigger', async () => {
      const step = await createStep({
        type: 'trigger',
      });

      vi.spyOn(Step.prototype, 'computeWebhookPath').mockResolvedValue(
        '/webhooks/flows/flow-id'
      );

      const newStep = await step.updateWebhookUrl();

      expect(step.webhookPath).toBe('/webhooks/flows/flow-id');
      expect(newStep).toBe(step);
    });

    it('should return step itself after the update of webhook path', async () => {
      const step = await createStep({
        type: 'trigger',
      });

      vi.spyOn(Step.prototype, 'computeWebhookPath').mockResolvedValue(
        '/webhooks/flows/flow-id'
      );

      const updatedStep = await step.updateWebhookUrl();

      expect(updatedStep).toStrictEqual(step);
    });
  });

  describe('delete', () => {
    it('should delete the step and align the positions', async () => {
      const flow = await createFlow();
      await createStep({ flowId: flow.id, position: 1, type: 'trigger' });
      await createStep({ flowId: flow.id, position: 2 });
      const stepToDelete = await createStep({ flowId: flow.id, position: 3 });
      await createStep({ flowId: flow.id, position: 4 });

      await stepToDelete.delete();

      const steps = await flow.$relatedQuery('steps');
      const stepIds = steps.map((step) => step.id);

      expect(stepIds).not.toContain(stepToDelete.id);
    });

    it('should align the positions of remaining steps', async () => {
      const flow = await createFlow();
      await createStep({ flowId: flow.id, position: 1, type: 'trigger' });
      await createStep({ flowId: flow.id, position: 2 });
      const stepToDelete = await createStep({ flowId: flow.id, position: 3 });
      await createStep({ flowId: flow.id, position: 4 });

      await stepToDelete.delete();

      const steps = await flow.$relatedQuery('steps');
      const stepPositions = steps.map((step) => step.position);

      expect(stepPositions).toMatchObject([1, 2, 3]);
    });

    it('should delete related execution steps', async () => {
      const step = await createStep();
      const executionStep = await createExecutionStep({ stepId: step.id });

      await step.delete();

      expect(await executionStep.$query()).toBe(undefined);
    });
  });

  describe('updateFor', async () => {
    let step,
      userRole,
      user,
      userConnection,
      anotherUser,
      anotherUserConnection;

    beforeEach(async () => {
      userRole = await createRole({ name: 'User' });
      anotherUser = await createUser({ roleId: userRole.id });
      user = await createUser({ roleId: userRole.id });

      userConnection = await createConnection({
        key: 'deepl',
        userId: user.id,
      });

      anotherUserConnection = await createConnection({
        key: 'deepl',
        userId: anotherUser.id,
      });

      await createPermission({
        roleId: userRole.id,
        action: 'read',
        subject: 'Connection',
        conditions: ['isCreator'],
      });

      step = await createStep();
    });

    it('should update step with the given payload and mark it as incomplete', async () => {
      const stepData = {
        appKey: 'deepl',
        key: 'translateText',
        connectionId: anotherUserConnection.id,
        parameters: {
          key: 'value',
        },
      };

      const anotherUserWithRoleAndPermissions = await anotherUser
        .$query()
        .withGraphFetched({ permissions: true, role: true });

      const updatedStep = await step.updateFor(
        anotherUserWithRoleAndPermissions,
        stepData
      );

      expect(updatedStep).toMatchObject({
        ...stepData,
        status: 'incomplete',
      });
    });

    it('should invoke updateWebhookUrl', async () => {
      const updateWebhookUrlSpy = vi
        .spyOn(Step.prototype, 'updateWebhookUrl')
        .mockResolvedValue();

      const stepData = {
        appKey: 'deepl',
        key: 'translateText',
      };

      await step.updateFor(user, stepData);

      expect(updateWebhookUrlSpy).toHaveBeenCalledOnce();
    });

    it('should not update step when inaccessible connection is given', async () => {
      const stepData = {
        appKey: 'deepl',
        key: 'translateText',
        connectionId: userConnection.id,
      };

      const anotherUserWithRoleAndPermissions = await anotherUser
        .$query()
        .withGraphFetched({ permissions: true, role: true });

      await expect(() =>
        step.updateFor(anotherUserWithRoleAndPermissions, stepData)
      ).rejects.toThrowError('NotFoundError');
    });

    it('should not update step when given app key and key do not exist', async () => {
      const stepData = {
        appKey: 'deepl',
        key: 'not-existing-key',
      };

      await expect(() => step.updateFor(user, stepData)).rejects.toThrowError(
        'DeepL does not have an action with the "not-existing-key" key!'
      );
    });
  });

  describe('updateRelatedMcpTools', async () => {
    it(`should update mcpTools with given step's toolName`, async () => {
      const step = await createStep({
        appKey: 'mcp',
        key: 'mcpTool',
        parameters: { toolName: 'newToolName' },
      });

      const mcpToolOne = await createMcpTool({
        flowId: step.flowId,
        action: 'oldToolName1',
      });

      const mcpToolTwo = await createMcpTool({
        flowId: step.flowId,
        action: 'oldToolName2',
      });

      await step.updateRelatedMcpTools();

      const updatedMcpToolOne = await mcpToolOne.$query();
      const updatedMcpToolTwo = await mcpToolTwo.$query();

      expect(updatedMcpToolOne.action).toBe('newToolName');
      expect(updatedMcpToolTwo.action).toBe('newToolName');
    });

    it('should not update mcpTools for non-mcpTool steps', async () => {
      const step = await createStep({
        parameters: { toolName: 'newToolName' },
      });

      const mcpToolQuerySpy = vi.spyOn(McpTool.prototype, '$query');

      await step.updateRelatedMcpTools();

      expect(mcpToolQuerySpy).not.toHaveBeenCalled();
    });
  });

  describe('validateParentStep', () => {
    it('should return true when there is no parent step', async () => {
      const step = new Step();
      step.parentStepId = null;

      const result = await step.validateParentStep();
      expect(result).toBe(true);
    });

    it('should throw an error if parent step is not a branch or paths', async () => {
      const parentStep = await createStep({ structuralType: 'single' });
      const step = new Step();
      step.parentStepId = parentStep.id;

      await expect(() => step.validateParentStep()).rejects.toThrowError(
        'Parent step must have structuralType of "branch" or "paths" to have children'
      );
    });

    it('should not throw an error if parent step is a paths', async () => {
      const parentStep = await createStep({ structuralType: 'paths' });
      const step = new Step();
      step.parentStepId = parentStep.id;

      await expect(step.validateParentStep()).resolves.not.toThrow();
    });

    it('should not throw an error if parent step is a branch', async () => {
      const parentStep = await createStep({
        structuralType: 'branch',
        branchConditions: [{ condition: 'true' }],
      });

      const step = new Step();
      step.parentStepId = parentStep.id;

      await expect(step.validateParentStep()).resolves.not.toThrow();
    });
  });

  describe('validateBranchConditions', () => {
    it('should return true when structural type is single', async () => {
      const step = new Step();
      step.structuralType = 'single';

      await expect(step.validateBranchConditions()).resolves.not.toThrow();
    });

    it('should return true when structural type is paths', async () => {
      const step = new Step();
      step.structuralType = 'paths';

      await expect(step.validateBranchConditions()).resolves.not.toThrow();
    });

    it('should throw an error when structural type is branch and branchConditions is not set', async () => {
      const step = new Step();
      step.structuralType = 'branch';

      await expect(step.validateBranchConditions()).rejects.toThrowError(
        'Branch conditions are required and must contain at least one condition!'
      );
    });

    it('should throw an error when structural type is branch and branchConditions is an empty array', async () => {
      const step = new Step();
      step.structuralType = 'branch';
      step.branchConditions = [];

      await expect(step.validateBranchConditions()).rejects.toThrowError(
        'Branch conditions are required and must contain at least one condition!'
      );
    });

    it('should not throw an error when structural type is branch and branchConditions is set with at least one condition', async () => {
      const step = new Step();
      step.structuralType = 'branch';
      step.branchConditions = [{ condition: 'true' }];

      await expect(step.validateBranchConditions()).resolves.not.toThrow();
    });
  });

  describe('$beforeInsert', () => {
    it('should call super.$beforeInsert', async () => {
      const superBeforeInsertSpy = vi.spyOn(Base.prototype, '$beforeInsert');

      await createStep();

      expect(superBeforeInsertSpy).toHaveBeenCalled();
    });

    it('should call validateParentStep', async () => {
      const validateParentStepSpy = vi.spyOn(
        Step.prototype,
        'validateParentStep'
      );

      await createStep();

      expect(validateParentStepSpy).toHaveBeenCalled();
    });

    it('should call validateBranchConditions', async () => {
      const validateBranchConditionsSpy = vi.spyOn(
        Step.prototype,
        'validateBranchConditions'
      );

      await createStep();

      expect(validateBranchConditionsSpy).toHaveBeenCalled();
    });
  });

  describe('$beforeUpdate', () => {
    it('should call super.$beforeUpdate', async () => {
      const superBeforeUpdateSpy = vi.spyOn(Base.prototype, '$beforeUpdate');

      const step = await createStep();

      await step.$query().patch({ position: 2 });

      expect(superBeforeUpdateSpy).toHaveBeenCalled();
    });

    it('should call validateParentStep', async () => {
      const validateParentStepSpy = vi.spyOn(
        Step.prototype,
        'validateParentStep'
      );

      const step = await createStep();

      await step.$query().patch({ position: 2 });

      expect(validateParentStepSpy).toHaveBeenCalled();
    });

    it('should call validateBranchConditions', async () => {
      const validateBranchConditionsSpy = vi.spyOn(
        Step.prototype,
        'validateBranchConditions'
      );

      const step = await createStep();
      await step.$query().patch({ position: 2 });

      expect(validateBranchConditionsSpy).toHaveBeenCalled();
    });
  });

  describe('$afterInsert', () => {
    it('should call super.$afterInsert', async () => {
      const superAfterInsertSpy = vi.spyOn(Base.prototype, '$afterInsert');

      await createStep();

      expect(superAfterInsertSpy).toHaveBeenCalled();
    });

    it('should call Telemetry.stepCreated', async () => {
      const telemetryStepCreatedSpy = vi
        .spyOn(Telemetry, 'stepCreated')
        .mockImplementation(() => {});

      const step = await createStep();

      expect(telemetryStepCreatedSpy).toHaveBeenCalledWith(step);
    });
  });

  describe('$afterUpdate', () => {
    it('should call super.$afterUpdate', async () => {
      const superAfterUpdateSpy = vi.spyOn(Base.prototype, '$afterUpdate');

      const step = await createStep();

      await step.$query().patch({ position: 2 });

      expect(superAfterUpdateSpy).toHaveBeenCalledOnce();
    });

    it('$afterUpdate should call Telemetry.stepUpdated', async () => {
      const telemetryStepUpdatedSpy = vi
        .spyOn(Telemetry, 'stepUpdated')
        .mockImplementation(() => {});

      const step = await createStep();

      await step.$query().patch({ position: 2 });

      expect(telemetryStepUpdatedSpy).toHaveBeenCalled({});
    });
  });
});
