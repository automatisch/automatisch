import { describe, it, expect } from 'vitest';
import nock from 'nock';
import auth from './index.js';
import verifyCredentials from './verify-credentials.js';
import isStillVerified from './is-still-verified.js';
import HttpError from '@/errors/http.js';
import App from '@/models/app.js';
import Connection from '@/models/connection.js';
import { createGlobalVariable } from '@/factories/global-variable.js';
import {
  account,
  envelope,
  errorEnvelope,
  SENT_API_URL,
  TEST_API_KEY,
} from '@/mocks/apps/sent/index.js';

const build = () =>
  createGlobalVariable({
    appKey: 'sent',
    formattedData: { apiKey: TEST_API_KEY },
  });

describe('Sent auth', () => {
  it('exposes only an API key field', () => {
    expect(auth.fields.map((field) => field.key)).toEqual(['apiKey']);
    expect(auth.fields[0]).toMatchObject({
      label: 'API Key',
      type: 'string',
      required: true,
    });
    expect(auth.verifyWebhook).toBeTypeOf('function');
  });

  it('reconnects without resetting the stored webhook secrets', async () => {
    const app = await App.findOneByKey('sent');

    expect(app.auth.reconnectionSteps.map((step) => step.name)).toEqual([
      'updateConnection',
      'verifyConnection',
    ]);
  });

  describe('verifyCredentials', () => {
    it('calls GET /v3/me with the API key and derives the screen name', async () => {
      const { $, connection } = await build();

      let requestHeaders;

      nock(SENT_API_URL)
        .get('/v3/me')
        .reply(function () {
          requestHeaders = this.req.headers;
          return [200, envelope(account)];
        });

      await verifyCredentials($);

      expect(requestHeaders['x-api-key']).toBe(TEST_API_KEY);
      expect($.auth.data.screenName).toBe(
        'Acme Corporation - ops@acme.example'
      );

      const persisted = await Connection.query().findById(connection.id);

      expect(persisted.formattedData).toEqual({
        apiKey: TEST_API_KEY,
        screenName: 'Acme Corporation - ops@acme.example',
      });
    });

    it('falls back to the account name when there is no email', async () => {
      const { $ } = await build();

      nock(SENT_API_URL)
        .get('/v3/me')
        .reply(200, envelope({ ...account, email: null }));

      await verifyCredentials($);

      expect($.auth.data.screenName).toBe('Acme Corporation');
    });

    it('rejects an invalid API key with the Sent error details', async () => {
      const { $, connection } = await build();

      nock(SENT_API_URL)
        .get('/v3/me')
        .reply(401, errorEnvelope('AUTH_002', 'Invalid or missing API key'));

      const error = await verifyCredentials($).catch((e) => e);

      expect(error).toBeInstanceOf(HttpError);
      expect(error.details.error.code).toBe('AUTH_002');
      expect(error.message).not.toContain(TEST_API_KEY);

      const persisted = await Connection.query().findById(connection.id);

      expect(persisted.formattedData.screenName).toBeUndefined();
    });
  });

  describe('isStillVerified', () => {
    it('returns true when the key still works', async () => {
      const { $ } = await build();

      nock(SENT_API_URL).get('/v3/me').reply(200, envelope(account));

      await expect(isStillVerified($)).resolves.toBe(true);
    });

    it('throws when the key no longer works', async () => {
      const { $ } = await build();

      nock(SENT_API_URL)
        .get('/v3/me')
        .reply(401, errorEnvelope('AUTH_002', 'Invalid or missing API key'));

      await expect(isStillVerified($)).rejects.toThrow(HttpError);
    });
  });
});
