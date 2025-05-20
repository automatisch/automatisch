import { describe, it, expect, vi, beforeEach } from 'vitest';
import Flow from './flow.js';
import User from './user.js';
import Base from './base.js';
import Step from './step.js';
import Folder from './folder.js';
import Execution from './execution.js';
import Telemetry from '../helpers/telemetry/index.js';
import * as globalVariableModule from '../helpers/global-variable.js';
import { createFlow } from '../../test/factories/flow.js';
import { createUser } from '../../test/factories/user.js';
import { createFolder } from '../../test/factories/folder.js';
import { createStep } from '../../test/factories/step.js';
import { createExecution } from '../../test/factories/execution.js';
import { createExecutionStep } from '../../test/factories/execution-step.js';
import * as exportFlow from '../helpers/export-flow.js';

describe('Flow model', () => {
  it('tableName should return correct name', () => {
    expect(Flow.tableName).toBe('flows');
  });

  it('jsonSchema should have correct validations', () => {
    expect(Flow.jsonSchema).toMatchSnapshot();
  });

  describe('relationMappings', () => {
    it('should return correct associations', () => {
      const relationMappings = Flow.relationMappings();

      const expectedRelations = {
        steps: {
          relation: Base.HasManyRelation,
          modelClass: Step,
          join: {
            from: 'flows.id',
            to: 'steps.flow_id',
          },
          filter: expect.any(Function),
        },
        triggerStep: {
          relation: Base.HasOneRelation,
          modelClass: Step,
          join: {
            from: 'flows.id',
            to: 'steps.flow_id',
          },
          filter: expect.any(Function),
        },
        executions: {
          relation: Base.HasManyRelation,
          modelClass: Execution,
          join: {
            from: 'flows.id',
            to: 'executions.flow_id',
          },
        },
        lastExecution: {
          relation: Base.HasOneRelation,
          modelClass: Execution,
          join: {
            from: 'flows.id',
            to: 'executions.flow_id',
          },
          filter: expect.any(Function),
        },
        user: {
          relation: Base.HasOneRelation,
          modelClass: User,
          join: {
            from: 'flows.user_id',
            to: 'users.id',
          },
        },
        folder: {
          relation: Base.HasOneRelation,
          modelClass: Folder,
          join: {
            from: 'flows.folder_id',
            to: 'folders.id',
          },
        },
      };

      expect(relationMappings).toStrictEqual(expectedRelations);
    });

    it('steps should return the steps', () => {
      const relations = Flow.relationMappings();
      const orderBySpy = vi.fn();

      relations.steps.filter({ orderBy: orderBySpy });

      expect(orderBySpy).toHaveBeenCalledWith('position', 'asc');
    });

    it('triggerStep should return the trigger step', () => {
      const relations = Flow.relationMappings();

      const firstSpy = vi.fn();

      const limitSpy = vi.fn().mockImplementation(() => ({
        first: firstSpy,
      }));

      const whereSpy = vi.fn().mockImplementation(() => ({
        limit: limitSpy,
      }));

      relations.triggerStep.filter({ where: whereSpy });

      expect(whereSpy).toHaveBeenCalledWith('type', 'trigger');
      expect(limitSpy).toHaveBeenCalledWith(1);
      expect(firstSpy).toHaveBeenCalledOnce();
    });

    it('lastExecution should return the last execution', () => {
      const relations = Flow.relationMappings();

      const firstSpy = vi.fn();

      const limitSpy = vi.fn().mockImplementation(() => ({
        first: firstSpy,
      }));

      const orderBySpy = vi.fn().mockImplementation(() => ({
        limit: limitSpy,
      }));

      relations.lastExecution.filter({ orderBy: orderBySpy });

      expect(orderBySpy).toHaveBeenCalledWith('created_at', 'desc');
      expect(limitSpy).toHaveBeenCalledWith(1);
      expect(firstSpy).toHaveBeenCalledOnce();
    });
  });

  describe('populateStatusProperty', () => {
    it('should assign "draft" to status property when a flow is not active', async () => {
      const referenceFlow = await createFlow({ active: false });

      const flows = [referenceFlow];

      vi.spyOn(referenceFlow, 'isPaused').mockResolvedValue();

      await Flow.populateStatusProperty(flows);

      expect(referenceFlow.status).toBe('draft');
    });

    it('should assign "paused" to status property when a flow is active, but should be paused', async () => {
      const referenceFlow = await createFlow({ active: true });

      const flows = [referenceFlow];

      vi.spyOn(referenceFlow, 'isPaused').mockResolvedValue(true);

      await Flow.populateStatusProperty(flows);

      expect(referenceFlow.status).toBe('paused');
    });

    it('should assign "published" to status property when a flow is active', async () => {
      const referenceFlow = await createFlow({ active: true });

      const flows = [referenceFlow];

      vi.spyOn(referenceFlow, 'isPaused').mockResolvedValue(false);

      await Flow.populateStatusProperty(flows);

      expect(referenceFlow.status).toBe('published');
    });
  });

  it('afterFind should call Flow.populateStatusProperty', async () => {
    const populateStatusPropertySpy = vi
      .spyOn(Flow, 'populateStatusProperty')
      .mockImplementation(() => {});

    await createFlow();

    expect(populateStatusPropertySpy).toHaveBeenCalledOnce();
  });

  describe('lastInternalId', () => {
    it('should return internal ID of last execution when exists', async () => {
      const flow = await createFlow();

      await createExecution({ flowId: flow.id });
      await createExecution({ flowId: flow.id });
      const lastExecution = await createExecution({ flowId: flow.id });

      expect(await flow.lastInternalId()).toBe(lastExecution.internalId);
    });

    it('should return null when no flow execution exists', async () => {
      const flow = await createFlow();

      expect(await flow.lastInternalId()).toBe(null);
    });
  });

  describe('lastInternalIds', () => {
    it('should return last internal IDs', async () => {
      const flow = await createFlow();

      const internalIds = [
        await createExecution({ flowId: flow.id }),
        await createExecution({ flowId: flow.id }),
        await createExecution({ flowId: flow.id }),
      ].map((execution) => execution.internalId);

      expect(await flow.lastInternalIds()).toStrictEqual(internalIds);
    });

    it('should return last 50 internal IDs by default', async () => {
      const flow = new Flow();

      const limitSpy = vi.fn().mockResolvedValue([]);

      vi.spyOn(flow, '$relatedQuery').mockReturnValue({
        select: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockReturnThis(),
        limit: limitSpy,
      });

      await flow.lastInternalIds();

      expect(limitSpy).toHaveBeenCalledWith(50);
    });
  });

  it('IncompleteStepsError should return validation error for incomplete steps', () => {
    expect(() => {
      throw Flow.IncompleteStepsError;
    }).toThrowError(
      'flow: All steps should be completed before updating flow status!'
    );
  });

  it('createInitialSteps should create one trigger and one action step', async () => {
    const flow = await createFlow();
    await flow.createInitialSteps();
    const steps = await flow.$relatedQuery('steps');

    expect(steps.length).toBe(2);

    expect(steps[0]).toMatchObject({
      flowId: flow.id,
      type: 'trigger',
      position: 1,
    });

    expect(steps[1]).toMatchObject({
      flowId: flow.id,
      type: 'action',
      position: 2,
    });
  });

  it('getStepById should return the step with the given ID from the flow', async () => {
    const flow = await createFlow();

    const step = await createStep({ flowId: flow.id });

    expect(await flow.getStepById(step.id)).toStrictEqual(step);
  });

  it('insertActionStepAtPosition should insert action step at given position', async () => {
    const flow = await createFlow();

    await flow.createInitialSteps();

    const createdStep = await flow.insertActionStepAtPosition(2);

    expect(createdStep).toMatchObject({
      type: 'action',
      position: 2,
    });
  });

  it('getStepsAfterPosition should return steps after the given position', async () => {
    const flow = await createFlow();

    await flow.createInitialSteps();

    await createStep({ flowId: flow.id });

    expect(await flow.getStepsAfterPosition(1)).toMatchObject([
      { position: 2 },
      { position: 3 },
    ]);
  });

  it('updateStepPositionsFrom', async () => {
    const flow = await createFlow();

    await createStep({ type: 'trigger', flowId: flow.id, position: 6 });
    await createStep({ type: 'action', flowId: flow.id, position: 8 });
    await createStep({ type: 'action', flowId: flow.id, position: 10 });

    await flow.updateStepPositionsFrom(2, await flow.$relatedQuery('steps'));

    expect(await flow.$relatedQuery('steps')).toMatchObject([
      { position: 2, type: 'trigger' },
      { position: 3, type: 'action' },
      { position: 4, type: 'action' },
    ]);
  });

  it('createStepAfter should create an action step after given step ID', async () => {
    const flow = await createFlow();

    const triggerStep = await createStep({ type: 'trigger', flowId: flow.id });
    const actionStep = await createStep({ type: 'action', flowId: flow.id });

    const createdStep = await flow.createStepAfter(triggerStep.id);

    const refetchedActionStep = await actionStep.$query();

    expect(createdStep).toMatchObject({ type: 'action', position: 2 });
    expect(refetchedActionStep.position).toBe(3);
  });

  describe('unregisterWebhook', () => {
    it('should unregister webhook on remote when supported', async () => {
      const flow = await createFlow();
      const triggerStep = await createStep({
        flowId: flow.id,
        appKey: 'typeform',
        key: 'new-entry',
        type: 'trigger',
      });

      const unregisterHookSpy = vi.fn().mockResolvedValue();

      vi.spyOn(Step.prototype, 'getTriggerCommand').mockResolvedValue({
        type: 'webhook',
        unregisterHook: unregisterHookSpy,
      });

      const globalVariableSpy = vi
        .spyOn(globalVariableModule, 'default')
        .mockResolvedValue('global-variable');

      await flow.unregisterWebhook();

      expect(unregisterHookSpy).toHaveBeenCalledWith('global-variable');
      expect(globalVariableSpy).toHaveBeenCalledWith({
        flow,
        step: triggerStep,
        connection: undefined,
        app: await triggerStep.getApp(),
      });
    });

    it('should silently fail when unregistration fails', async () => {
      const flow = await createFlow();
      await createStep({
        flowId: flow.id,
        appKey: 'typeform',
        key: 'new-entry',
        type: 'trigger',
      });

      const unregisterHookSpy = vi.fn().mockRejectedValue(new Error());

      vi.spyOn(Step.prototype, 'getTriggerCommand').mockResolvedValue({
        type: 'webhook',
        unregisterHook: unregisterHookSpy,
      });

      expect(await flow.unregisterWebhook()).toBe(undefined);
      expect(unregisterHookSpy).toHaveBeenCalledOnce();
    });

    it('should do nothing when trigger step is not webhook', async () => {
      const flow = await createFlow();
      await createStep({
        flowId: flow.id,
        type: 'trigger',
      });

      const unregisterHookSpy = vi.fn().mockRejectedValue(new Error());

      expect(await flow.unregisterWebhook()).toBe(undefined);
      expect(unregisterHookSpy).not.toHaveBeenCalled();
    });
  });

  it('deleteExecutionSteps should delete related execution steps', async () => {
    const flow = await createFlow();
    const execution = await createExecution({ flowId: flow.id });
    const firstExecutionStep = await createExecutionStep({
      executionId: execution.id,
    });
    const secondExecutionStep = await createExecutionStep({
      executionId: execution.id,
    });

    await flow.deleteExecutionSteps();

    expect(await firstExecutionStep.$query()).toBe(undefined);
    expect(await secondExecutionStep.$query()).toBe(undefined);
  });

  it('deleteExecutions should delete related executions', async () => {
    const flow = await createFlow();
    const firstExecution = await createExecution({ flowId: flow.id });
    const secondExecution = await createExecution({ flowId: flow.id });

    await flow.deleteExecutions();

    expect(await firstExecution.$query()).toBe(undefined);
    expect(await secondExecution.$query()).toBe(undefined);
  });

  it('deleteSteps should delete related steps', async () => {
    const flow = await createFlow();
    await flow.createInitialSteps();
    await flow.deleteSteps();

    expect(await flow.$relatedQuery('steps')).toStrictEqual([]);
  });

  it('delete should delete the flow with its relations', async () => {
    const flow = await createFlow();

    const unregisterWebhookSpy = vi
      .spyOn(flow, 'unregisterWebhook')
      .mockResolvedValue();
    const deleteExecutionStepsSpy = vi
      .spyOn(flow, 'deleteExecutionSteps')
      .mockResolvedValue();
    const deleteExecutionsSpy = vi
      .spyOn(flow, 'deleteExecutions')
      .mockResolvedValue();
    const deleteStepsSpy = vi.spyOn(flow, 'deleteSteps').mockResolvedValue();

    await flow.delete();

    expect(unregisterWebhookSpy).toHaveBeenCalledOnce();
    expect(deleteExecutionStepsSpy).toHaveBeenCalledOnce();
    expect(deleteExecutionsSpy).toHaveBeenCalledOnce();
    expect(deleteStepsSpy).toHaveBeenCalledOnce();
    expect(await flow.$query()).toBe(undefined);
  });

  it.todo('duplicateFor');

  it('getTriggerStep', async () => {
    const flow = await createFlow();
    const triggerStep = await createStep({ flowId: flow.id, type: 'trigger' });

    await createStep({ flowId: flow.id, type: 'action' });

    expect(await flow.getTriggerStep()).toStrictEqual(triggerStep);
  });

  describe('isPaused', () => {
    it('should return true when user.isAllowedToRunFlows returns false', async () => {
      const flow = await createFlow();

      const isAllowedToRunFlowsSpy = vi.fn().mockResolvedValue(false);
      vi.spyOn(flow, '$relatedQuery').mockReturnValue({
        withSoftDeleted: vi.fn().mockReturnThis(),
        isAllowedToRunFlows: isAllowedToRunFlowsSpy,
      });

      expect(await flow.isPaused()).toBe(true);
      expect(isAllowedToRunFlowsSpy).toHaveBeenCalledOnce();
    });

    it('should return false when user.isAllowedToRunFlows returns true', async () => {
      const flow = await createFlow();

      const isAllowedToRunFlowsSpy = vi.fn().mockResolvedValue(true);
      vi.spyOn(flow, '$relatedQuery').mockReturnValue({
        withSoftDeleted: vi.fn().mockReturnThis(),
        isAllowedToRunFlows: isAllowedToRunFlowsSpy,
      });

      expect(await flow.isPaused()).toBe(false);
      expect(isAllowedToRunFlowsSpy).toHaveBeenCalledOnce();
    });
  });

  describe('updateFolder', () => {
    it('should throw an error if the folder does not exist', async () => {
      const user = await createUser();
      const flow = await createFlow({ userId: user.id });
      const nonExistentFolderId = 'non-existent-folder-id';

      await expect(flow.updateFolder(nonExistentFolderId)).rejects.toThrow();
    });

    it('should return the flow with the updated folder', async () => {
      const user = await createUser();
      const flow = await createFlow({ userId: user.id });
      const folder = await createFolder({ userId: user.id });

      const updatedFlow = await flow.updateFolder(folder.id);

      expect(updatedFlow.folder.id).toBe(folder.id);
      expect(updatedFlow.folder.name).toBe(folder.name);
    });

    it('should return the flow with null folder when folderId is null', async () => {
      const user = await createUser();
      const flow = await createFlow({ userId: user.id });

      const updatedFlow = await flow.updateFolder(null);

      expect(updatedFlow.folder).toBe(null);
    });
  });

  describe('updateFolderReference', () => {
    it('should update the folder reference and return the flow with the updated folder', async () => {
      const user = await createUser();
      const flow = await createFlow({ userId: user.id });
      const folder = await createFolder({ userId: user.id });

      const updatedFlow = await flow.updateFolderReference(folder.id);

      expect(updatedFlow.folder.id).toBe(folder.id);
      expect(updatedFlow.folder.name).toBe(folder.name);
    });

    it('should update the folder reference to null and return the flow with null folder', async () => {
      const user = await createUser();
      const flow = await createFlow({ userId: user.id });

      const updatedFlow = await flow.updateFolderReference(null);

      expect(updatedFlow.folder).toBe(null);
    });
  });

  describe('throwIfHavingIncompleteSteps', () => {
    it('should throw validation error with incomplete steps', async () => {
      const flow = await createFlow();

      await flow.createInitialSteps();

      await expect(() =>
        flow.throwIfHavingIncompleteSteps()
      ).rejects.toThrowError(
        'flow: All steps should be completed before updating flow status!'
      );
    });

    it('should return undefined when all steps are completed', async () => {
      const flow = await createFlow();

      await createStep({
        flowId: flow.id,
        status: 'completed',
        type: 'trigger',
      });

      await createStep({
        flowId: flow.id,
        status: 'completed',
        type: 'action',
      });

      expect(await flow.throwIfHavingIncompleteSteps()).toBe(undefined);
    });
  });

  describe('export', () => {
    it('should return exportedFlow', async () => {
      const flow = await createFlow();

      const exportedFlowAsString = {
        name: 'My Flow Name',
      };

      vi.spyOn(exportFlow, 'default').mockReturnValue(exportedFlowAsString);

      expect(await flow.export()).toStrictEqual({
        name: 'My Flow Name',
      });
    });
  });

  describe('throwIfHavingLessThanTwoSteps', () => {
    it('should throw validation error with less than two steps', async () => {
      const flow = await createFlow();

      await expect(() =>
        flow.throwIfHavingLessThanTwoSteps()
      ).rejects.toThrowError(
        'flow: There should be at least one trigger and one action steps in the flow!'
      );
    });

    it('should return undefined when there are at least two steps', async () => {
      const flow = await createFlow();

      await createStep({
        flowId: flow.id,
        type: 'trigger',
      });

      await createStep({
        flowId: flow.id,
        type: 'action',
      });

      expect(await flow.throwIfHavingLessThanTwoSteps()).toBe(undefined);
    });
  });

  describe('find', () => {
    let userOne,
      userTwo,
      userOneFolder,
      userTwoFolder,
      flowOne,
      flowTwo,
      flowThree;

    beforeEach(async () => {
      userOne = await createUser();
      userTwo = await createUser();

      userOneFolder = await createFolder({ userId: userOne.id });
      userTwoFolder = await createFolder({ userId: userTwo.id });

      flowOne = await createFlow({
        userId: userOne.id,
        folderId: userOneFolder.id,
        active: true,
        name: 'Flow One',
      });

      flowTwo = await createFlow({
        userId: userOne.id,
        active: false,
        name: 'Flow Two',
      });

      flowThree = await createFlow({
        userId: userTwo.id,
        name: 'Flow Three',
        folderId: userTwoFolder.id,
      });
    });

    it('should return flows filtered by name', async () => {
      const flows = await Flow.find({ name: 'Flow Two' });

      expect(flows).toHaveLength(1);
      expect(flows[0].id).toBe(flowTwo.id);
    });

    it('should return flows filtered by published status', async () => {
      const flows = await Flow.find({ status: 'published' });

      expect(flows).toHaveLength(1);
      expect(flows[0].id).toBe(flowOne.id);
    });

    it('should return flows filtered by draft status', async () => {
      const flows = await Flow.find({ status: 'draft' });

      expect(flows).toHaveLength(2);
      expect(flows[1].id).toBe(flowTwo.id);
      expect(flows[0].id).toBe(flowThree.id);
    });

    it('should return flows filtered by name and status', async () => {
      const flows = await Flow.find({ name: 'Flow One', status: 'published' });

      expect(flows).toHaveLength(1);
      expect(flows[0].id).toBe(flowOne.id);
    });

    it('should return flows filtered by userId', async () => {
      const flows = await Flow.find({ userId: userOne.id });

      expect(flows).toHaveLength(2);
      expect(flows[0].id).toBe(flowOne.id);
      expect(flows[1].id).toBe(flowTwo.id);
    });

    it('should return flows filtered by onlyOwnedFlows with null folderId', async () => {
      const flows = await Flow.find({ onlyOwnedFlows: true, folderId: 'null' });

      expect(flows).toHaveLength(1);
      expect(flows[0].id).toBe(flowTwo.id);
    });

    it('should return flows with specific folder ID', async () => {
      const flows = await Flow.find({ folderId: userOneFolder.id });

      expect(flows.length).toBe(1);
      expect(flows[0].id).toBe(flowOne.id);
    });

    it('should return flows filtered by folderId and name', async () => {
      const flows = await Flow.find({
        folderId: userOneFolder.id,
        name: 'Flow One',
      });

      expect(flows).toHaveLength(1);
      expect(flows[0].id).toBe(flowOne.id);
    });

    it('should return all flows if no filters are provided', async () => {
      const flows = await Flow.find({});

      expect(flows).toHaveLength(3);
      expect(flows.map((flow) => flow.id)).toEqual(
        expect.arrayContaining([flowOne.id, flowTwo.id, flowThree.id])
      );
    });

    it('should return uncategorized flows if the folderId is null', async () => {
      const flows = await Flow.find({ folderId: 'null' });

      expect(flows).toHaveLength(1);
      expect(flows.map((flow) => flow.id)).toEqual([flowTwo.id]);
    });

    it('should return specified flows with all filters together', async () => {
      const flows = await Flow.find({
        folderId: userOneFolder.id,
        name: 'Flow One',
        status: 'published',
        onlyOwnedFlows: true,
      });

      expect(flows).toHaveLength(1);
      expect(flows[0].id).toBe(flowOne.id);
    });
  });

  describe('$beforeUpdate', () => {
    it('should invoke throwIfHavingIncompleteSteps when flow is becoming active', async () => {
      const flow = await createFlow({ active: false });

      const throwIfHavingIncompleteStepsSpy = vi
        .spyOn(Flow.prototype, 'throwIfHavingIncompleteSteps')
        .mockImplementation(() => {});

      const throwIfHavingLessThanTwoStepsSpy = vi
        .spyOn(Flow.prototype, 'throwIfHavingLessThanTwoSteps')
        .mockImplementation(() => {});

      await flow.$query().patch({ active: true });

      expect(throwIfHavingIncompleteStepsSpy).toHaveBeenCalledOnce();
      expect(throwIfHavingLessThanTwoStepsSpy).toHaveBeenCalledOnce();
    });

    it('should invoke throwIfHavingIncompleteSteps when flow is not becoming active', async () => {
      const flow = await createFlow({ active: true });

      const throwIfHavingIncompleteStepsSpy = vi
        .spyOn(Flow.prototype, 'throwIfHavingIncompleteSteps')
        .mockImplementation(() => {});

      const throwIfHavingLessThanTwoStepsSpy = vi
        .spyOn(Flow.prototype, 'throwIfHavingLessThanTwoSteps')
        .mockImplementation(() => {});

      await flow.$query().patch({});

      expect(throwIfHavingIncompleteStepsSpy).not.toHaveBeenCalledOnce();
      expect(throwIfHavingLessThanTwoStepsSpy).not.toHaveBeenCalledOnce();
    });
  });

  describe('$afterInsert', () => {
    it('should call super.$afterInsert', async () => {
      const superAfterInsertSpy = vi.spyOn(Base.prototype, '$afterInsert');

      await createFlow();

      expect(superAfterInsertSpy).toHaveBeenCalled();
    });

    it('should call Telemetry.flowCreated', async () => {
      const telemetryFlowCreatedSpy = vi
        .spyOn(Telemetry, 'flowCreated')
        .mockImplementation(() => {});

      const flow = await createFlow();

      expect(telemetryFlowCreatedSpy).toHaveBeenCalledWith(flow);
    });
  });

  describe('$afterUpdate', () => {
    it('should call super.$afterUpdate', async () => {
      const superAfterUpdateSpy = vi.spyOn(Base.prototype, '$afterUpdate');

      const flow = await createFlow();

      await flow.$query().patch({ active: false });

      expect(superAfterUpdateSpy).toHaveBeenCalledOnce();
    });

    it('$afterUpdate should call Telemetry.flowUpdated', async () => {
      const telemetryFlowUpdatedSpy = vi
        .spyOn(Telemetry, 'flowUpdated')
        .mockImplementation(() => {});

      const flow = await createFlow();

      await flow.$query().patch({ active: false });

      expect(telemetryFlowUpdatedSpy).toHaveBeenCalled({});
    });
  });
});
