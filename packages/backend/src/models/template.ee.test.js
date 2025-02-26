import { describe, it, expect } from 'vitest';
import Crypto from 'crypto';
import Template from './template.ee.js';
import { createFlow } from '../../test/factories/flow';
import { createStep } from '../../test/factories/step';

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
});
