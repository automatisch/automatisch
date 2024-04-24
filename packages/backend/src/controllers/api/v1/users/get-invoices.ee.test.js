import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import app from '../../../../app.js';
import createAuthTokenByUserId from '../../../../helpers/create-auth-token-by-user-id';
import { createUser } from '../../../../../test/factories/user';
import User from '../../../../models/user';
import getInvoicesMock from '../../../../../test/mocks/rest/api/v1/users/get-invoices.ee';

describe('GET /api/v1/user/invoices', () => {
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
      .get('/api/v1/users/invoices')
      .set('Authorization', token)
      .expect(200);

    const expectedPayload = await getInvoicesMock(invoices);

    expect(response.body).toEqual(expectedPayload);
  });
});
