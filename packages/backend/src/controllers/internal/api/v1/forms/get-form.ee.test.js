import { vi, describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import Crypto from 'crypto';
import app from '../../../../../app.js';
import { createUser } from '../../../../../../test/factories/user.js';
import { createFlow } from '../../../../../../test/factories/flow.js';
import { createStep } from '../../../../../../test/factories/step.js';
import * as license from '../../../../../helpers/license.ee.js';
import getFormMock from '../../../../../../test/mocks/rest/internal/api/v1/forms/get-form.ee.js';

describe('GET /internal/api/v1/forms/:formId', () => {
  let currentUser, flow, formStep;

  beforeEach(async () => {
    vi.spyOn(license, 'hasValidLicense').mockResolvedValue(true);

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
            fieldKey: 'email',
            fieldName: 'email',
            fieldType: 'string',
            required: true,
          },
          {
            fieldKey: 'name',
            fieldName: 'name',
            fieldType: 'string',
            required: true,
          },
        ],
      },
    });
  });

  it('should return form data when trigger step is forms', async () => {
    const response = await request(app)
      .get(`/internal/api/v1/forms/${flow.id}`)
      .expect(200);

    const expectedPayload = getFormMock(flow, formStep);

    expect(response.body).toStrictEqual(expectedPayload);
  });

  it('should return 400 for invalid trigger step', async () => {
    await formStep.$query().patch({ appKey: 'github' });

    const response = await request(app)
      .get(`/internal/api/v1/forms/${flow.id}`)
      .expect(400);

    expect(response.body.errors).toStrictEqual({
      general: ['Invalid trigger step'],
    });
  });

  it('should return 404 for non-existent form', async () => {
    const nonExistentFormId = Crypto.randomUUID();

    await request(app)
      .get(`/internal/api/v1/forms/${nonExistentFormId}`)
      .expect(404);
  });
});
