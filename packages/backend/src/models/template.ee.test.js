import { describe, it, expect, vi, beforeEach } from 'vitest';
import Crypto from 'crypto';
import Template from './template.ee.js';
import { createFlow } from '../../test/factories/flow';
import { createStep } from '../../test/factories/step';
import appConfig from '../config/app.js';

describe('Template model', () => {
  it('tableName should return correct name', () => {
    expect(Template.tableName).toBe('templates');
  });

  it('jsonSchema should have correct validations', () => {
    expect(Template.jsonSchema).toMatchSnapshot();
  });

  describe('create', () => {
    it('should throw an error if the flow does not exist', async () => {
      const nonExistentFlowId = Crypto.randomUUID();
      const templateName = 'Test Template';

      await expect(
        Template.create({ name: templateName, flowId: nonExistentFlowId })
      ).rejects.toThrowError('NotFoundError');
    });

    it('should create template with the name', async () => {
      const flow = await createFlow();
      const templateName = 'Test Template';

      const template = await Template.create({
        name: templateName,
        flowId: flow.id,
      });

      expect(template.name).toStrictEqual(templateName);
    });

    it('should create template with the flow data', async () => {
      const flow = await createFlow();

      const triggerStep = await createStep({
        flowId: flow.id,
        type: 'trigger',
        appKey: 'webhook',
        key: 'catchRawWebhook',
      });

      await createStep({
        flowId: flow.id,
        type: 'action',
        appKey: 'ntfy',
        key: 'sendMessage',
        parameters: {
          topic: 'Test notification',
          message: `Message: {{step.${triggerStep.id}.body.message}} by {{step.${triggerStep.id}.body.sender}}`,
        },
      });

      const templateName = 'Test Template';
      const template = await Template.create({
        name: templateName,
        flowId: flow.id,
      });

      const exportedFlowData = await flow.export();

      expect(template.flowData).toMatchObject({
        name: exportedFlowData.name,
        steps: template.flowData.steps.map((step) => ({
          appKey: step.appKey,
          key: step.key,
          name: step.name,
          position: step.position,
          type: step.type,
        })),
      });
    });
  });

  describe('getFlowDataWithIconUrls', () => {
    beforeEach(() => {
      vi.spyOn(appConfig, 'baseUrl', 'get').mockReturnValue(
        'https://automatisch.io'
      );
    });

    it('should add iconUrl to each step in flowData', () => {
      const template = new Template();
      template.flowData = {
        id: 'flow-id',
        name: 'Test Flow',
        steps: [
          {
            id: 'step-1',
            appKey: 'webhook',
            type: 'trigger',
          },
          {
            id: 'step-2',
            appKey: 'formatter',
            type: 'action',
          },
        ],
      };

      const result = template.getFlowDataWithIconUrls();

      expect(result.steps[0].iconUrl).toBe(
        'https://automatisch.io/apps/webhook/assets/favicon.svg'
      );
      expect(result.steps[1].iconUrl).toBe(
        'https://automatisch.io/apps/formatter/assets/favicon.svg'
      );
    });

    it('should handle steps with null appKey', () => {
      const template = new Template();
      template.flowData = {
        id: 'flow-id',
        name: 'Test Flow',
        steps: [
          {
            id: 'step-1',
            appKey: null,
            type: 'trigger',
          },
        ],
      };

      const result = template.getFlowDataWithIconUrls();

      expect(result.steps[0].iconUrl).toBeNull();
    });

    it('should preserve all other flowData properties', () => {
      const template = new Template();
      template.flowData = {
        id: 'flow-id',
        name: 'Test Flow',
        customField: 'test',
        steps: [
          {
            id: 'step-1',
            appKey: 'webhook',
            type: 'trigger',
            position: 1,
            parameters: { test: true },
          },
        ],
      };

      const result = template.getFlowDataWithIconUrls();

      expect(result).toEqual({
        id: 'flow-id',
        name: 'Test Flow',
        customField: 'test',
        steps: [
          {
            id: 'step-1',
            appKey: 'webhook',
            type: 'trigger',
            position: 1,
            parameters: { test: true },
            iconUrl: 'https://automatisch.io/apps/webhook/assets/favicon.svg',
          },
        ],
      });
    });
  });
});
