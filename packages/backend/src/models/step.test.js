import { describe, it, expect, vi } from 'vitest';
import appConfig from '../config/app.js';
import App from './app.js';
import Base from './base.js';
import Step from './step.js';
import Flow from './flow.js';
import Connection from './connection.js';
import ExecutionStep from './execution-step.js';
import * as testRunModule from '../services/test-run.js';
import { createStep } from '../../test/factories/step.js';
import { createExecutionStep } from '../../test/factories/execution-step.js';

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

  it('isTrigger should return true when step type is trigger', () => {
    const step = new Step();
    step.type = 'trigger';

    expect(step.isTrigger).toBe(true);
  });

  it('isAction should return true when step type is action', () => {
    const step = new Step();
    step.type = 'action';

    expect(step.isAction).toBe(true);
  });

  describe.todo('computeWebhookPath');

  describe('getWebhookUrl', () => {
    it('should return absolute webhook URL when step type is trigger', async () => {
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

    it('should return undefined when step type is action', async () => {
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

  it('test should execute the flow and mark the step as completed', async () => {
    const step = await createStep({ status: 'incomplete' });

    const testRunSpy = vi.spyOn(testRunModule, 'default').mockResolvedValue();

    const updatedStep = await step.test();

    expect(testRunSpy).toHaveBeenCalledWith({ stepId: step.id });
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
    it('should return trigger comamand when app key and key are defined in trigger step', async () => {
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
});
