import { describe, it, expect, vi } from 'vitest';
import appConfig from '../config/app.js';
import Base from './base.js';
import Step from './step.js';
import Flow from './flow.js';
import Connection from './connection.js';
import ExecutionStep from './execution-step.js';

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
});
