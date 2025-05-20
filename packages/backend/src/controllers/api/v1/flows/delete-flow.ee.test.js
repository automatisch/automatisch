import Crypto from 'node:crypto';
import request from 'supertest';
import { beforeEach, describe, it, vi } from 'vitest';
import { createApiToken } from '../../../../../test/factories/api-token.js';
import { createFlow } from '../../../../../test/factories/flow.js';
import app from '../../../../app.js';
import * as license from '../../../../helpers/license.ee.js';

describe('DELETE /api/v1/flows/:flowId', () => {
  let token;

  beforeEach(async () => {
    vi.spyOn(license, 'hasValidLicense').mockResolvedValue(true);

    token = (await createApiToken()).token;
  });

  it('should remove the flow and return no content', async () => {
    const flow = await createFlow();

    await request(app)
      .delete(`/api/v1/flows/${flow.id}`)
      .set('x-api-token', token)
      .expect(204);
  });

  it('should return not found response for not existing flow UUID', async () => {
    const notExistingFlowUUID = Crypto.randomUUID();

    await request(app)
      .delete(`/api/v1/flows/${notExistingFlowUUID}`)
      .set('x-api-token', token)
      .expect(404);
  });

  it('should return bad request response for invalid UUID', async () => {
    await request(app)
      .delete('/api/v1/flows/invalidFlowUUID')
      .set('x-api-token', token)
      .expect(400);
  });
});
