import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import nock from 'nock';
import { createGlobalVariable } from '@/factories/global-variable.js';
import {
  account,
  envelope,
  SENT_API_URL,
  TEST_API_KEY,
} from '@/mocks/apps/sent/index.js';

const build = () =>
  createGlobalVariable({
    appKey: 'sent',
    formattedData: { apiKey: TEST_API_KEY, screenName: 'Sent' },
  });

describe('Sent request security through $.http', () => {
  beforeEach(() => {
    nock.disableNetConnect();
  });

  afterEach(() => {
    nock.enableNetConnect();
  });

  it('authenticates relative Sent v3 paths', async () => {
    const { $ } = await build();

    const scope = nock(SENT_API_URL)
      .get('/v3/me')
      .matchHeader('x-api-key', TEST_API_KEY)
      .reply(200, envelope(account));

    const response = await $.http.get('/v3/me');

    expect(response.status).toBe(200);
    expect(scope.isDone()).toBe(true);
  });

  it('authenticates absolute Sent v3 URLs', async () => {
    const { $ } = await build();

    const scope = nock(SENT_API_URL)
      .get('/v3/me')
      .matchHeader('x-api-key', TEST_API_KEY)
      .reply(200, envelope(account));

    await $.http.get(`${SENT_API_URL}/v3/me`);

    expect(scope.isDone()).toBe(true);
  });

  it.each([
    'https://evil.example/collect',
    '//evil.example/collect',
    'http://api.sent.dm/v3/me',
    'https://api.sent.dm.evil.example/v3/me',
    'https://api.sent.dm/v2/messages',
    '/v2/messages',
    '/v3/../v2/messages',
  ])('never sends the API key to %s', async (url) => {
    const { $ } = await build();

    const foreignScope = nock(/evil\.example/)
      .persist()
      .get(/.*/)
      .reply(200, {});
    const sentScope = nock(SENT_API_URL).persist().get(/.*/).reply(200, {});

    const error = await $.http.get(url).catch((e) => e);

    expect(error.message).toContain(
      'Sent connections can only send requests to https://api.sent.dm/v3/… endpoints.'
    );
    expect(error.message).not.toContain(TEST_API_KEY);
    expect(foreignScope.isDone()).toBe(false);
    expect(sentScope.isDone()).toBe(false);
  });

  it('replaces a caller supplied x-api-key with the connection key', async () => {
    const { $ } = await build();

    let requestHeaders;

    nock(SENT_API_URL)
      .get('/v3/me')
      .reply(function () {
        requestHeaders = this.req.headers;
        return [200, envelope(account)];
      });

    await $.http.get('/v3/me', { headers: { 'X-API-KEY': 'attacker-key' } });

    expect(requestHeaders['x-api-key']).toBe(TEST_API_KEY);
    expect(JSON.stringify(requestHeaders)).not.toContain('attacker-key');
  });

  it('keeps optional Sent headers and custom headers', async () => {
    const { $ } = await build();

    let requestHeaders;

    nock(SENT_API_URL)
      .post('/v3/messages')
      .reply(function () {
        requestHeaders = this.req.headers;
        return [202, envelope({})];
      });

    await $.http.post(
      '/v3/messages',
      {},
      {
        headers: {
          'x-profile-id': '660e8400-e29b-41d4-a716-446655440001',
          'Idempotency-Key': 'order-1',
          'X-Custom': 'yes',
        },
      }
    );

    expect(requestHeaders['x-api-key']).toBe(TEST_API_KEY);
    expect(requestHeaders['x-profile-id']).toBe(
      '660e8400-e29b-41d4-a716-446655440001'
    );
    expect(requestHeaders['idempotency-key']).toBe('order-1');
    expect(requestHeaders['x-custom']).toBe('yes');
  });
});
