import { vi, describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import Crypto from 'crypto';
import app from '../../../../../app.js';
import { createUser } from '../../../../../../test/factories/user.js';
import { createFlow } from '../../../../../../test/factories/flow.js';
import { createStep } from '../../../../../../test/factories/step.js';
import * as license from '../../../../../helpers/license.ee.js';
import * as formHandler from '../../../../../helpers/form-handler.ee.js';

describe('POST /internal/api/v1/forms/:formId', () => {
  let currentUser, flow, formStep;

  beforeEach(async () => {
    vi.spyOn(license, 'hasValidLicense').mockResolvedValue(true);
    vi.spyOn(formHandler, 'default').mockResolvedValue(undefined);

    currentUser = await createUser();
    flow = await createFlow({ userId: currentUser.id });

    formStep = await createStep({
      flowId: flow.id,
      appKey: 'forms',
      key: 'form',
      type: 'trigger',
      parameters: {
        fields: [
          {
            fieldName: 'email',
            fieldKey: 'email',
            fieldType: 'string',
            required: true,
          },
          {
            fieldName: 'name',
            fieldKey: 'name',
            fieldType: 'string',
            required: true,
          },
        ],
      },
    });
  });

  it('should process form submission successfully', async () => {
    const formData = {
      name: 'John Doe',
      email: 'john@example.com',
    };

    await request(app)
      .post(`/internal/api/v1/forms/${flow.id}`)
      .send(formData)
      .expect(204);
  });

  it('should return 400 for invalid trigger step', async () => {
    await formStep.$query().patch({ appKey: 'github' });

    const formData = {
      name: 'John Doe',
      email: 'john@example.com',
    };

    const response = await request(app)
      .post(`/internal/api/v1/forms/${flow.id}`)
      .send(formData)
      .expect(400);

    expect(response.body.errors).toStrictEqual({
      general: ['Invalid trigger step'],
    });
  });

  it('should return 404 for non-existent form', async () => {
    const nonExistentFormId = Crypto.randomUUID();

    const formData = {
      name: 'John Doe',
      email: 'john@example.com',
    };

    await request(app)
      .post(`/internal/api/v1/forms/${nonExistentFormId}`)
      .send(formData)
      .expect(404);
  });
});
