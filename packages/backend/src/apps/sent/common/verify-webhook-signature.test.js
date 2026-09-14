import { describe, it, expect } from 'vitest';
import crypto from 'crypto';
import {
  computeWebhookSignature,
  decodeSigningSecret,
  isUsableSigningSecret,
  verifyWebhookSignature,
  SIGNATURE_TOLERANCE_SECONDS,
} from './verify-webhook-signature.js';
import {
  OTHER_SIGNING_SECRET,
  TEST_SIGNING_SECRET,
} from '@/mocks/apps/sent/index.js';

const WEBHOOK_ID = 'd4f5a6b7-c8d9-4e0f-a1b2-c3d4e5f6a7b8';
const TIMESTAMP = '1768478400';
const NOW_MS = Number(TIMESTAMP) * 1000;
const RAW_BODY = Buffer.from(
  '{"field":"message","event":"message.received","payload":{"text":"héllo 👋"}}'
);

const sign = (overrides = {}) =>
  computeWebhookSignature({
    webhookId: WEBHOOK_ID,
    timestamp: TIMESTAMP,
    rawBody: RAW_BODY,
    signingSecret: TEST_SIGNING_SECRET,
    ...overrides,
  });

const verify = (overrides = {}) =>
  verifyWebhookSignature({
    webhookId: WEBHOOK_ID,
    timestamp: TIMESTAMP,
    signature: sign(),
    rawBody: RAW_BODY,
    signingSecret: TEST_SIGNING_SECRET,
    nowMs: NOW_MS,
    ...overrides,
  });

describe('Sent webhook signature', () => {
  describe('computeWebhookSignature', () => {
    it('matches an independently computed known vector', () => {
      const key = Buffer.alloc(32);
      const expected = crypto
        .createHmac('sha256', key)
        .update(
          Buffer.concat([Buffer.from(`${WEBHOOK_ID}.${TIMESTAMP}.`), RAW_BODY])
        )
        .digest('base64');

      expect(sign()).toBe(`v1,${expected}`);
    });

    it('produces a deterministic signature for a fixed input', () => {
      const signature = computeWebhookSignature({
        webhookId: 'webhook',
        timestamp: '1',
        rawBody: Buffer.from('{}'),
        signingSecret: TEST_SIGNING_SECRET,
      });

      expect(signature).toBe('v1,X2jutiDxN0qJH9tDGAGE7GZT5BQY5a6Ak9+/7OGxIyo=');
    });

    it('throws for a malformed secret', () => {
      expect(() => sign({ signingSecret: 'not-a-secret' })).toThrow(
        'Malformed Sent webhook signing secret.'
      );
    });
  });

  describe('decodeSigningSecret', () => {
    it('decodes the base64 part after the whsec_ prefix', () => {
      expect(decodeSigningSecret(TEST_SIGNING_SECRET)).toEqual(
        Buffer.alloc(32)
      );
      expect(isUsableSigningSecret(TEST_SIGNING_SECRET)).toBe(true);
    });

    it('rejects secrets without prefix, with bad base64 or empty keys', () => {
      expect(decodeSigningSecret('AAAA')).toBeNull();
      expect(decodeSigningSecret('whsec_')).toBeNull();
      expect(decodeSigningSecret('whsec_!!!')).toBeNull();
      expect(decodeSigningSecret(undefined)).toBeNull();
      expect(isUsableSigningSecret(null)).toBe(false);
    });
  });

  describe('verifyWebhookSignature', () => {
    it('accepts a valid signature', () => {
      expect(verify()).toBe(true);
    });

    it('accepts a valid signature among space separated candidates', () => {
      expect(verify({ signature: `v1,${'A'.repeat(43)}= ${sign()}` })).toBe(
        true
      );
    });

    it('rejects a tampered body', () => {
      const tamperedBody = Buffer.from(
        RAW_BODY.toString('utf8').replace('héllo', 'hello')
      );

      expect(verify({ rawBody: tamperedBody })).toBe(false);
    });

    it('rejects whitespace differences in the body', () => {
      const reformatted = Buffer.from(
        JSON.stringify(JSON.parse(RAW_BODY.toString('utf8')), null, 2)
      );

      expect(verify({ rawBody: reformatted })).toBe(false);
    });

    it('rejects a signature made with another secret', () => {
      expect(
        verify({ signature: sign({ signingSecret: OTHER_SIGNING_SECRET }) })
      ).toBe(false);
      expect(verify({ signingSecret: OTHER_SIGNING_SECRET })).toBe(false);
    });

    it('rejects a signature made for another webhook id', () => {
      expect(verify({ signature: sign({ webhookId: 'other-webhook' }) })).toBe(
        false
      );
    });

    it('rejects missing or malformed signatures', () => {
      expect(verify({ signature: undefined })).toBe(false);
      expect(verify({ signature: '' })).toBe(false);
      expect(verify({ signature: sign().slice(3) })).toBe(false);
      expect(verify({ signature: `v2,${sign().slice(3)}` })).toBe(false);
      expect(verify({ signature: 'v1,not base64!' })).toBe(false);
      expect(verify({ signature: 'v1,QUJD' })).toBe(false);
    });

    it('rejects a missing raw body or a string body', () => {
      expect(verify({ rawBody: undefined })).toBe(false);
      expect(verify({ rawBody: RAW_BODY.toString('utf8') })).toBe(false);
    });

    it('rejects stale and future timestamps beyond the tolerance', () => {
      const tooOld = NOW_MS + (SIGNATURE_TOLERANCE_SECONDS + 1) * 1000;
      const tooNew = NOW_MS - (SIGNATURE_TOLERANCE_SECONDS + 1) * 1000;
      const edge = NOW_MS + SIGNATURE_TOLERANCE_SECONDS * 1000;

      expect(verify({ nowMs: tooOld })).toBe(false);
      expect(verify({ nowMs: tooNew })).toBe(false);
      expect(verify({ nowMs: edge })).toBe(true);
    });

    it('rejects missing or malformed timestamps', () => {
      expect(verify({ timestamp: undefined })).toBe(false);
      expect(verify({ timestamp: 'now' })).toBe(false);
      expect(verify({ timestamp: '1768478400.5' })).toBe(false);
      expect(verify({ timestamp: '-1' })).toBe(false);
    });

    it('rejects an unusable secret', () => {
      expect(verify({ signingSecret: 'whsec_' })).toBe(false);
      expect(verify({ signingSecret: undefined })).toBe(false);
    });
  });
});
