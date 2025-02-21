import { describe, it, expect, beforeEach } from 'vitest';
import templateSerializer from './template.ee.js';
import { createTemplate } from '../../../test/factories/template.js';

describe('adminTemplateSerializer', () => {
  let template;

  beforeEach(async () => {
    template = await createTemplate();
  });

  it('should return flow data', async () => {
    const expectedPayload = {
      id: template.id,
      name: template.name,
      flowData: template.flowData,
      createdAt: template.createdAt.getTime(),
      updatedAt: template.updatedAt.getTime(),
    };

    expect(templateSerializer(template)).toStrictEqual(expectedPayload);
  });
});
