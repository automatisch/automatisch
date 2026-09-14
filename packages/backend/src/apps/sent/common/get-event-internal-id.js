import crypto from 'crypto';

const stableStringify = (value) => {
  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(',')}]`;
  }

  if (value && typeof value === 'object') {
    const entries = Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`);

    return `{${entries.join(',')}}`;
  }

  return JSON.stringify(value);
};

/**
 * Deterministic identifier for a Sent webhook event so that Sent's delivery
 * retries do not execute a flow twice, while every new lifecycle state does.
 */
const getEventInternalId = (event) => {
  const payload = event?.payload ?? {};

  if (event?.event === 'message.received' && payload.message_id) {
    return `message.received:${payload.message_id}`;
  }

  if (
    event?.field === 'message' &&
    payload.message_id &&
    payload.message_status
  ) {
    return `message:${payload.message_id}:${payload.message_status}`;
  }

  if (event?.field === 'templates' && payload.template_id && payload.status) {
    return `templates:${payload.template_id}:${payload.status}`;
  }

  const digest = crypto
    .createHash('sha256')
    .update(stableStringify(event ?? null))
    .digest('hex');

  return `sha256:${digest}`;
};

export default getEventInternalId;
