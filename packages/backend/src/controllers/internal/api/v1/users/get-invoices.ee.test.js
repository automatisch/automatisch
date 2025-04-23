import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import app from '../../../../../app.js';
import createAuthTokenByUserId from '../../../../../helpers/create-auth-token-by-user-id.js';
import { createUser } from '../../../../../../test/factories/user.js';
import User from '../../../../../models/user.js';
import getInvoicesMock from '../../../../../../test/mocks/rest/internal/api/v1/users/get-invoices.ee.js';

describe('GET /internal/api/v1/user/invoices', () => {
  let currentUser, token;

  beforeEach(async () => {
    currentUser = await createUser();
    token = await createAuthTokenByUserId(currentUser.id);
  });

  it('should return current user invoices', async () => {
    const invoices = [
      { id: 1, amount: 100, description: 'Invoice 1' },
      { id: 2, amount: 200, description: 'Invoice 2' },
    ];

    vi.spyOn(User.prototype, 'getInvoices').mockResolvedValue(invoices);

    const response = await request(app)
      .get('/internal/api/v1/users/invoices')
      .set('Authorization', token)
      .expect(200);

    const expectedPayload = await getInvoicesMock(invoices);

    expect(response.body).toStrictEqual(expectedPayload);
  });
});
