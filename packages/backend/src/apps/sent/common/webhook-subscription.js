import HttpError from '../../../errors/http.js';
import getProfileHeaders from './get-profile-headers.js';
import { isUsableSigningSecret } from './verify-webhook-signature.js';

const WEBHOOK_RETRY_COUNT = 3;
const WEBHOOK_TIMEOUT_SECONDS = 30;

const isNotFound = (error) =>
  error instanceof HttpError && error.response?.status === 404;

const deleteRemoteWebhook = async ($, remoteWebhookId, headers) => {
  try {
    await $.http.delete(`/v3/webhooks/${encodeURIComponent(remoteWebhookId)}`, {
      headers,
    });
  } catch (error) {
    if (!isNotFound(error)) throw error;
  }
};

const storeSigningSecret = async ($, remoteWebhookId, signingSecret) => {
  await $.auth.set((currentData) => ({
    webhookSigningSecrets: {
      ...currentData?.webhookSigningSecrets,
      [remoteWebhookId]: { signingSecret, flowId: $.flow.id },
    },
  }));
};

const removeSigningSecret = async ($, remoteWebhookId) => {
  await $.auth.set((currentData) => {
    const webhookSigningSecrets = { ...currentData?.webhookSigningSecrets };

    delete webhookSigningSecrets[remoteWebhookId];

    return { webhookSigningSecrets };
  });
};

const bestEffort = async (operation) => {
  try {
    await operation();
  } catch {
    // The original error is more relevant than a failed rollback step.
  }
};

/**
 * Creates the Sent webhook for a published flow and stores its signing secret
 * in the connection, keyed by the remote webhook ID. Each flow gets its own
 * webhook and secret, so several flows can share one Sent connection.
 */
export const registerWebhook = async ($, subscription) => {
  const headers = getProfileHeaders($.step.parameters.senderProfileId);

  // Clean up a webhook left behind by an earlier, interrupted lifecycle step.
  // This must never block publishing, so remote failures are tolerated.
  if ($.flow.remoteWebhookId) {
    const staleWebhookId = $.flow.remoteWebhookId;

    await bestEffort(() => deleteRemoteWebhook($, staleWebhookId, headers));
    await removeSigningSecret($, staleWebhookId);
  }

  const payload = {
    display_name: `Automatisch (flow ${$.flow.id})`,
    endpoint_url: $.webhookUrl,
    ...subscription,
    retry_count: WEBHOOK_RETRY_COUNT,
    timeout_seconds: WEBHOOK_TIMEOUT_SECONDS,
  };

  const response = await $.http.post('/v3/webhooks', payload, { headers });
  const webhook = response.data?.data;
  const remoteWebhookId = webhook?.id;
  const signingSecret = webhook?.signing_secret;

  if (!remoteWebhookId || !isUsableSigningSecret(signingSecret)) {
    if (remoteWebhookId) {
      await bestEffort(() => deleteRemoteWebhook($, remoteWebhookId, headers));
    }

    throw new Error(
      'Sent did not return a webhook ID and signing secret, so the webhook cannot be verified.'
    );
  }

  try {
    await storeSigningSecret($, remoteWebhookId, signingSecret);
  } catch (error) {
    await bestEffort(() => deleteRemoteWebhook($, remoteWebhookId, headers));

    throw error;
  }

  try {
    await $.flow.setRemoteWebhookId(remoteWebhookId);
  } catch (error) {
    await bestEffort(() => removeSigningSecret($, remoteWebhookId));
    await bestEffort(() => deleteRemoteWebhook($, remoteWebhookId, headers));

    throw error;
  }
};

/**
 * Deletes the flow's Sent webhook and forgets only its signing secret.
 * Safe to repeat: an already deleted remote webhook is not an error.
 */
export const unregisterWebhook = async ($) => {
  const remoteWebhookId = $.flow.remoteWebhookId;

  if (!remoteWebhookId) return;

  const headers = getProfileHeaders($.step.parameters.senderProfileId);

  await deleteRemoteWebhook($, remoteWebhookId, headers);
  await removeSigningSecret($, remoteWebhookId);
};
