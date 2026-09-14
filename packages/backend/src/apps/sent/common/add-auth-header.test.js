import { describe, it, expect } from 'vitest';
import addAuthHeader from './add-auth-header.js';
import getProfileHeaders from './get-profile-headers.js';

const $ = { auth: { data: { apiKey: 'test-sent-api-key' } } };

const run = (requestConfig) => addAuthHeader($, { ...requestConfig });

describe('Sent addAuthHeader', () => {
  it('attaches the API key to relative Sent v3 paths', () => {
    const config = run({
      baseURL: 'https://api.sent.dm',
      url: '/v3/me',
      headers: {},
    });

    expect(config.headers.get('x-api-key')).toBe('test-sent-api-key');
  });

  it('attaches the API key to absolute Sent v3 URLs', () => {
    const config = run({ url: 'https://api.sent.dm/v3/messages', headers: {} });

    expect(config.headers.get('x-api-key')).toBe('test-sent-api-key');
  });

  it.each([
    ['https://evil.example/collect'],
    ['//evil.example/collect'],
    ['http://api.sent.dm/v3/me'],
    ['https://api.sent.dm.evil.example/v3/me'],
    ['https://api.sent.dm@evil.example/v3/me'],
    ['https://api.sent.dm/v2/messages'],
    ['https://api.sent.dm/v3/../v2/messages'],
    ['https://api.sent.dm/'],
    ['https://api.sent.dm/v30/messages'],
  ])('rejects %s before attaching credentials', (url) => {
    expect(() =>
      run({ baseURL: 'https://api.sent.dm', url, headers: {} })
    ).toThrow(
      'Sent connections can only send requests to https://api.sent.dm/v3/… endpoints.'
    );
  });

  it('rejects relative paths outside /v3 and requests without a base URL', () => {
    expect(() =>
      run({ baseURL: 'https://api.sent.dm', url: '/v2/me', headers: {} })
    ).toThrow();
    expect(() => run({ url: '/v3/me', headers: {} })).toThrow();
  });

  it('replaces a caller supplied x-api-key in any casing', () => {
    const config = run({
      baseURL: 'https://api.sent.dm',
      url: '/v3/me',
      headers: { 'X-API-KEY': 'attacker-key', 'x-api-key': 'another-key' },
    });

    expect(config.headers.get('x-api-key')).toBe('test-sent-api-key');
    expect(Object.keys(config.headers.toJSON())).toEqual(['x-api-key']);
  });

  it('preserves other caller headers', () => {
    const config = run({
      baseURL: 'https://api.sent.dm',
      url: '/v3/messages',
      headers: {
        ...getProfileHeaders('660e8400-e29b-41d4-a716-446655440001'),
        'Idempotency-Key': 'order-1',
        'X-Custom': 'yes',
      },
    });

    expect(config.headers.get('x-profile-id')).toBe(
      '660e8400-e29b-41d4-a716-446655440001'
    );
    expect(config.headers.get('Idempotency-Key')).toBe('order-1');
    expect(config.headers.get('X-Custom')).toBe('yes');
  });

  it('does not add a header when the connection has no key', () => {
    const config = addAuthHeader(
      { auth: { data: {} } },
      { baseURL: 'https://api.sent.dm', url: '/v3/me', headers: {} }
    );

    expect(config.headers.has('x-api-key')).toBe(false);
  });
});

describe('getProfileHeaders', () => {
  it('only sends x-profile-id for a selected profile', () => {
    expect(getProfileHeaders('')).toEqual({});
    expect(getProfileHeaders(undefined)).toEqual({});
    expect(getProfileHeaders('  ')).toEqual({});
    expect(getProfileHeaders(' abc ')).toEqual({ 'x-profile-id': 'abc' });
  });
});
