import { validate as isUuid } from 'uuid';

const E164_PATTERN = /^\+[1-9]\d{1,14}$/;
const IDEMPOTENCY_KEY_PATTERN = /^[a-zA-Z0-9_-]{1,255}$/;

export const channelOptions = [
  { label: 'Automatic routing (recommended)', value: 'sent' },
  { label: 'SMS', value: 'sms' },
  { label: 'WhatsApp', value: 'whatsapp' },
  { label: 'RCS', value: 'rcs' },
];

export const SUPPORTED_CHANNELS = channelOptions.map((option) => option.value);

const splitList = (value) =>
  String(value ?? '')
    .split(/[,\n]/)
    .map((item) => item.trim())
    .filter(Boolean);

export const isE164PhoneNumber = (value) =>
  typeof value === 'string' && E164_PATTERN.test(value);

export const parsePhoneNumbers = (value, label = 'Recipient phone numbers') => {
  const phoneNumbers = splitList(value);

  if (phoneNumbers.length === 0) {
    throw new Error(`${label} must contain at least one phone number.`);
  }

  const invalidPhoneNumbers = phoneNumbers.filter(
    (phoneNumber) => !isE164PhoneNumber(phoneNumber)
  );

  if (invalidPhoneNumbers.length > 0) {
    throw new Error(
      `${label} must be in E.164 format (for example +14155550100). Invalid: ${invalidPhoneNumbers.join(
        ', '
      )}`
    );
  }

  return phoneNumbers;
};

export const parseChannels = (value) => {
  const channels = splitList(value).map((channel) => channel.toLowerCase());

  if (channels.length === 0) return ['sent'];

  const invalidChannels = channels.filter(
    (channel) => !SUPPORTED_CHANNELS.includes(channel)
  );

  if (invalidChannels.length > 0) {
    throw new Error(
      `Channel must be one of ${SUPPORTED_CHANNELS.join(
        ', '
      )}. Invalid: ${invalidChannels.join(', ')}`
    );
  }

  return [...new Set(channels)];
};

export const assertUuid = (value, label) => {
  if (typeof value !== 'string' || !isUuid(value.trim())) {
    throw new Error(`${label} must be a valid UUID.`);
  }

  return value.trim();
};

export const assertIdempotencyKey = (value) => {
  if (typeof value !== 'string' || !IDEMPOTENCY_KEY_PATTERN.test(value)) {
    throw new Error(
      'Idempotency key must be 1-255 characters of letters, digits, hyphens or underscores.'
    );
  }

  return value;
};

export const parsePositiveInteger = (value, label, { max, fallback }) => {
  if (value === undefined || value === null || value === '') return fallback;

  const number = Number(value);

  if (!Number.isInteger(number) || number < 1 || (max && number > max)) {
    throw new Error(
      `${label} must be a whole number between 1 and ${max ?? 'unlimited'}.`
    );
  }

  return number;
};
