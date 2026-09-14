import { describe, it, expect } from 'vitest';
import {
  assertIdempotencyKey,
  assertUuid,
  isE164PhoneNumber,
  parseChannels,
  parsePhoneNumbers,
  parsePositiveInteger,
} from './validators.js';

describe('Sent validators', () => {
  describe('parsePhoneNumbers', () => {
    it('accepts one or more E.164 numbers separated by commas or newlines', () => {
      expect(parsePhoneNumbers('+14155550100')).toEqual(['+14155550100']);
      expect(
        parsePhoneNumbers(' +14155550100 , +442071234567\n+4915112345678 ')
      ).toEqual(['+14155550100', '+442071234567', '+4915112345678']);
    });

    it('rejects empty input', () => {
      expect(() => parsePhoneNumbers('')).toThrow('at least one phone number');
      expect(() => parsePhoneNumbers(undefined)).toThrow(
        'at least one phone number'
      );
    });

    it('rejects numbers that are not E.164 without guessing country codes', () => {
      expect(() => parsePhoneNumbers('4155550100')).toThrow(
        'Invalid: 4155550100'
      );
      expect(() => parsePhoneNumbers('+1 415 555 0100')).toThrow('E.164');
      expect(() => parsePhoneNumbers('+0123')).toThrow('E.164');
      expect(() => parsePhoneNumbers('+14155550100, 0800123')).toThrow(
        'Invalid: 0800123'
      );
      expect(isE164PhoneNumber('+1234567890123456')).toBe(false);
    });
  });

  describe('parseChannels', () => {
    it('defaults to automatic routing', () => {
      expect(parseChannels('')).toEqual(['sent']);
      expect(parseChannels(undefined)).toEqual(['sent']);
    });

    it('accepts supported channels and broadcast lists', () => {
      expect(parseChannels('sms')).toEqual(['sms']);
      expect(parseChannels('WhatsApp, sms, sms')).toEqual(['whatsapp', 'sms']);
    });

    it('rejects unsupported channels', () => {
      expect(() => parseChannels('email')).toThrow('Invalid: email');
    });
  });

  describe('assertUuid', () => {
    it('accepts UUIDs and rejects anything else', () => {
      expect(
        assertUuid(' 8BA7B830-9dad-11d1-80b4-00c04fd430c8 ', 'Message ID')
      ).toBe('8BA7B830-9dad-11d1-80b4-00c04fd430c8');
      expect(() => assertUuid('abc', 'Message ID')).toThrow(
        'Message ID must be a valid UUID.'
      );
      expect(() => assertUuid(undefined, 'Contact ID')).toThrow(
        'Contact ID must be a valid UUID.'
      );
    });
  });

  describe('assertIdempotencyKey', () => {
    it('accepts Sent compatible keys and rejects others', () => {
      expect(assertIdempotencyKey('order-123_retry')).toBe('order-123_retry');
      expect(() => assertIdempotencyKey('has space')).toThrow(
        'Idempotency key'
      );
      expect(() => assertIdempotencyKey('a'.repeat(256))).toThrow(
        'Idempotency key'
      );
    });
  });

  describe('parsePositiveInteger', () => {
    it('applies fallbacks and bounds', () => {
      expect(parsePositiveInteger('', 'Page', { fallback: 1 })).toBe(1);
      expect(parsePositiveInteger('7', 'Page', { fallback: 1 })).toBe(7);
      expect(
        parsePositiveInteger(100, 'Page size', { max: 100, fallback: 20 })
      ).toBe(100);
      expect(() =>
        parsePositiveInteger('101', 'Page size', { max: 100, fallback: 20 })
      ).toThrow('between 1 and 100');
      expect(() => parsePositiveInteger('0', 'Page', { fallback: 1 })).toThrow(
        'Page'
      );
      expect(() =>
        parsePositiveInteger('1.5', 'Page', { fallback: 1 })
      ).toThrow('Page');
    });
  });
});
