import crypto from 'crypto';

export const SIGNATURE_VERSION = 'v1';
export const SIGNATURE_TOLERANCE_SECONDS = 300;
export const SIGNING_SECRET_PREFIX = 'whsec_';

const BASE64_PATTERN = /^[A-Za-z0-9+/]+={0,2}$/;

export const decodeSigningSecret = (signingSecret) => {
  if (
    typeof signingSecret !== 'string' ||
    !signingSecret.startsWith(SIGNING_SECRET_PREFIX)
  ) {
    return null;
  }

  const encodedKey = signingSecret.slice(SIGNING_SECRET_PREFIX.length);

  if (!BASE64_PATTERN.test(encodedKey)) return null;

  const key = Buffer.from(encodedKey, 'base64');

  return key.length > 0 ? key : null;
};

export const isUsableSigningSecret = (signingSecret) =>
  decodeSigningSecret(signingSecret) !== null;

const computeDigest = ({ webhookId, timestamp, rawBody, key }) =>
  crypto
    .createHmac('sha256', key)
    .update(`${webhookId}.${timestamp}.`, 'utf8')
    .update(rawBody)
    .digest();

export const computeWebhookSignature = ({
  webhookId,
  timestamp,
  rawBody,
  signingSecret,
}) => {
  const key = decodeSigningSecret(signingSecret);

  if (!key) {
    throw new Error('Malformed Sent webhook signing secret.');
  }

  const digest = computeDigest({ webhookId, timestamp, rawBody, key });

  return `${SIGNATURE_VERSION},${digest.toString('base64')}`;
};

const isTimestampWithinTolerance = (timestamp, nowMs) => {
  if (typeof timestamp !== 'string' || !/^\d{1,13}$/.test(timestamp)) {
    return false;
  }

  const timestampSeconds = Number(timestamp);
  const nowSeconds = Math.floor(nowMs / 1000);

  return Math.abs(nowSeconds - timestampSeconds) <= SIGNATURE_TOLERANCE_SECONDS;
};

const decodeSignature = (signature) => {
  const [version, encodedDigest, ...rest] = String(signature).split(',');

  if (
    version !== SIGNATURE_VERSION ||
    rest.length > 0 ||
    !encodedDigest ||
    !BASE64_PATTERN.test(encodedDigest)
  ) {
    return null;
  }

  return Buffer.from(encodedDigest, 'base64');
};

/**
 * Verifies a Sent webhook delivery. The signed content is
 * `{X-Webhook-ID}.{X-Webhook-Timestamp}.{raw request body}`, signed with
 * HMAC-SHA256 using the base64-decoded signing secret and compared in
 * constant time. Deliveries older or newer than the tolerance are rejected.
 */
export const verifyWebhookSignature = ({
  webhookId,
  timestamp,
  signature,
  rawBody,
  signingSecret,
  nowMs = Date.now(),
}) => {
  if (
    typeof webhookId !== 'string' ||
    webhookId.length === 0 ||
    typeof signature !== 'string' ||
    !Buffer.isBuffer(rawBody)
  ) {
    return false;
  }

  if (!isTimestampWithinTolerance(timestamp, nowMs)) return false;

  const key = decodeSigningSecret(signingSecret);

  if (!key) return false;

  const expectedDigest = computeDigest({ webhookId, timestamp, rawBody, key });

  // Sent sends exactly one signature today; the split is defensive.
  return signature.split(' ').some((candidate) => {
    const receivedDigest = decodeSignature(candidate.trim());

    return (
      receivedDigest !== null &&
      receivedDigest.length === expectedDigest.length &&
      crypto.timingSafeEqual(receivedDigest, expectedDigest)
    );
  });
};
