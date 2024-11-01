import { describe, it, expect, vi } from 'vitest';
import Flow from './flow.js';
import User from './user.js';
import Base from './base.js';
import Step from './step.js';
import Execution from './execution.js';
import { createFlow } from '../../test/factories/flow.js';
import { createStep } from '../../test/factories/step.js';
import { createExecution } from '../../test/factories/execution.js';

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

  describe.todo('afterFind - possibly refactor to persist');

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

  it('createActionStepAfterStep should create an action step after given step ID', async () => {
    const flow = await createFlow();

    const triggerStep = await createStep({ type: 'trigger', flowId: flow.id });
    const actionStep = await createStep({ type: 'action', flowId: flow.id });

    const createdStep = await flow.createActionStepAfterStepId(triggerStep.id);

    const refetchedActionStep = await actionStep.$query();

    expect(createdStep).toMatchObject({ type: 'action', position: 2 });
    expect(refetchedActionStep.position).toBe(3);
  });

  it.todo('delete');

  it.todo('duplicateFor');

  it('getTriggerStep', async () => {
    const flow = await createFlow();
    const triggerStep = await createStep({ flowId: flow.id, type: 'trigger' });

    await createStep({ flowId: flow.id, type: 'action' });

    expect(await flow.getTriggerStep()).toStrictEqual(triggerStep);
  });

  it.todo('isPaused');

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
});
