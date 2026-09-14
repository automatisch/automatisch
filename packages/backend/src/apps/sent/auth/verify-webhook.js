import { verifyWebhookSignature } from '../common/verify-webhook-signature.js';

const getHeader = (headers, name) => {
  const value = headers?.[name];

  return typeof value === 'string' ? value : undefined;
};

/**
 * Every Sent webhook registered from Automatisch has its own signing secret,
 * stored in the connection keyed by the remote webhook ID (`X-Webhook-ID`) and
 * bound to the flow that created it. Deliveries are verified against the exact
 * raw request body; unknown webhooks, other flows' webhooks, stale timestamps
 * and bad signatures are rejected.
 */
const verifyWebhook = async ($) => {
  const request = $.request;
  const webhookId = getHeader(request?.headers, 'x-webhook-id');
  const timestamp = getHeader(request?.headers, 'x-webhook-timestamp');
  const signature = getHeader(request?.headers, 'x-webhook-signature');

  if (!webhookId || !timestamp || !signature) return false;

  const webhookSecret = $.auth.data?.webhookSigningSecrets?.[webhookId];

  if (!webhookSecret?.signingSecret) return false;

  if (webhookSecret.flowId !== request.params?.flowId) return false;

  return verifyWebhookSignature({
    webhookId,
    timestamp,
    signature,
    rawBody: request.rawBody,
    signingSecret: webhookSecret.signingSecret,
  });
};

export default verifyWebhook;
