import { describe, it, expect } from 'vitest';
import nock from 'nock';
import getAccount from './index.js';
import { createGlobalVariable } from '@/factories/global-variable.js';
import {
  account,
  envelope,
  errorEnvelope,
  SENT_API_URL,
  TEST_API_KEY,
} from '@/mocks/apps/sent/index.js';

const build = (stepParameters = {}) =>
  createGlobalVariable({
    appKey: 'sent',
    formattedData: { apiKey: TEST_API_KEY, screenName: 'Sent' },
    stepKey: 'getAccount',
    stepParameters,
  });

describe('Sent get account action', () => {
  it('returns the full account response for an organization', async () => {
    const { $ } = await build();

    nock(SENT_API_URL).get('/v3/me').reply(200, envelope(account));

    await getAccount.run($);

    expect($.actionOutput.data.raw).toEqual(envelope(account));
    expect($.actionOutput.data.raw.data.profiles).toHaveLength(1);
  });

  it('returns a standalone user account', async () => {
    const { $ } = await build();
    const userAccount = { ...account, type: 'user', profiles: [] };

    nock(SENT_API_URL).get('/v3/me').reply(200, envelope(userAccount));

    await getAccount.run($);

    expect($.actionOutput.data.raw.data.type).toBe('user');
  });

  it('scopes to a sender profile when selected', async () => {
    const { $ } = await build({
      senderProfileId: '660e8400-e29b-41d4-a716-446655440001',
    });

    let requestHeaders;

    nock(SENT_API_URL)
      .get('/v3/me')
      .reply(function () {
        requestHeaders = this.req.headers;
        return [200, envelope({ ...account, type: 'profile' })];
      });

    await getAccount.run($);

    expect(requestHeaders['x-profile-id']).toBe(
      '660e8400-e29b-41d4-a716-446655440001'
    );
    expect($.actionOutput.data.raw.data.type).toBe('profile');
  });

  it('does not send x-profile-id when no profile is selected', async () => {
    const { $ } = await build({ senderProfileId: '' });

    let requestHeaders;

    nock(SENT_API_URL)
      .get('/v3/me')
      .reply(function () {
        requestHeaders = this.req.headers;
        return [200, envelope(account)];
      });

    await getAccount.run($);

    expect(requestHeaders['x-profile-id']).toBeUndefined();
  });

  it('surfaces API errors with Sent details', async () => {
    const { $ } = await build();

    nock(SENT_API_URL)
      .get('/v3/me')
      .reply(403, errorEnvelope('AUTH_004', 'Access denied'));

    const error = await getAccount.run($).catch((e) => e);

    expect(error.response.status).toBe(403);
    expect(error.details.error.code).toBe('AUTH_004');
  });
});
