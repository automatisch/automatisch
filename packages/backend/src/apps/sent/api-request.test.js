import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import nock from 'nock';
import App from '@/models/app.js';
import { createGlobalVariable } from '@/factories/global-variable.js';
import {
  account,
  envelope,
  errorEnvelope,
  SENT_API_URL,
  TEST_API_KEY,
} from '@/mocks/apps/sent/index.js';

const buildApiRequest = async (stepParameters) => {
  const app = await App.findOneByKey('sent');
  const apiRequest = app.actions.find((action) => action.key === 'apiRequest');

  const { $ } = await createGlobalVariable({
    appKey: 'sent',
    app,
    formattedData: { apiKey: TEST_API_KEY, screenName: 'Sent' },
    stepKey: 'apiRequest',
    stepParameters,
  });

  return { $, apiRequest };
};

describe('Sent generic API Request action', () => {
  beforeEach(() => {
    nock.disableNetConnect();
  });

  afterEach(() => {
    nock.enableNetConnect();
  });

  it('is injected exactly once', async () => {
    const app = await App.findOneByKey('sent');
    const apiRequestActions = app.actions.filter(
      (action) => action.key === 'apiRequest'
    );

    expect(apiRequestActions).toHaveLength(1);
    expect(apiRequestActions[0].substeps.map((s) => s.key)).toEqual([
      'chooseConnection',
      'chooseTrigger',
      'testStep',
    ]);
  });

  it('performs an authenticated GET with query parameters and custom headers', async () => {
    const { $, apiRequest } = await buildApiRequest({
      method: 'get',
      endpoint: '/v3/me',
      queryParams: [{ key: 'foo', value: 'bar' }],
      headers: [
        { key: 'x-profile-id', value: '660e8400-e29b-41d4-a716-446655440001' },
        { key: 'x-api-key', value: 'attacker-key' },
      ],
    });

    let requestHeaders;

    nock(SENT_API_URL)
      .get('/v3/me')
      .query({ foo: 'bar' })
      .reply(function () {
        requestHeaders = this.req.headers;
        return [200, envelope(account), { 'x-request-id': 'req_1' }];
      });

    await apiRequest.run($);

    expect(requestHeaders['x-api-key']).toBe(TEST_API_KEY);
    expect(requestHeaders['x-profile-id']).toBe(
      '660e8400-e29b-41d4-a716-446655440001'
    );

    const output = $.actionOutput.data.raw;

    expect(output.status).toBe(200);
    expect(output.statusText).toBeDefined();
    expect(output.data).toEqual(envelope(account));
    expect(output.headers['x-request-id']).toBe('req_1');
  });

  it('sends a JSON body with POST and an idempotency key', async () => {
    const { $, apiRequest } = await buildApiRequest({
      method: 'post',
      endpoint: '/v3/messages',
      headers: [{ key: 'Idempotency-Key', value: 'order-1' }],
      data: '{"to":["+14155550100"],"text":"hi","sandbox":true}',
    });

    let requestHeaders;
    let requestBody;

    nock(SENT_API_URL)
      .post('/v3/messages', (body) => {
        requestBody = body;
        return true;
      })
      .reply(function () {
        requestHeaders = this.req.headers;
        return [202, envelope({ status: 'QUEUED' })];
      });

    await apiRequest.run($);

    expect(requestBody).toEqual({
      to: ['+14155550100'],
      text: 'hi',
      sandbox: true,
    });
    expect(requestHeaders['idempotency-key']).toBe('order-1');
    expect(requestHeaders['x-api-key']).toBe(TEST_API_KEY);
    expect($.actionOutput.data.raw.status).toBe(202);
  });

  it('surfaces Sent errors', async () => {
    const { $, apiRequest } = await buildApiRequest({
      method: 'get',
      endpoint: '/v3/messages/not-a-uuid',
    });

    nock(SENT_API_URL)
      .get('/v3/messages/not-a-uuid')
      .reply(
        400,
        errorEnvelope('VALIDATION_001', 'Invalid message ID format.')
      );

    const error = await apiRequest.run($).catch((e) => e);

    expect(error.details.error.code).toBe('VALIDATION_001');
  });

  it.each([
    'https://evil.example/collect',
    'http://api.sent.dm/v3/me',
    '/v2/messages',
  ])('rejects %s and never leaks the API key', async (endpoint) => {
    const { $, apiRequest } = await buildApiRequest({
      method: 'get',
      endpoint,
    });

    const foreignScope = nock(/evil\.example|api\.sent\.dm/)
      .persist()
      .get(/.*/)
      .reply(200, {});

    const error = await apiRequest.run($).catch((e) => e);

    expect(error.message).toContain('Sent connections can only send requests');
    expect(error.message).not.toContain(TEST_API_KEY);
    expect(foreignScope.isDone()).toBe(false);
  });
});
