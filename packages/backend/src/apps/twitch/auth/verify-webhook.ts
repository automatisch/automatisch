import crypto from 'crypto';
import { IGlobalVariable } from '@automatisch/types';
import appConfig from '../../../config/app';

const verifyWebhook = async ($: IGlobalVariable) => {
  const signature = $.request.headers[
    'twitch-eventsub-message-signature'
  ] as string;
  const twitchMessageId = $.request.headers[
    'twitch-eventsub-message-id'
  ] as string;
  const twitchMessageTimestamp = $.request.headers[
    'twitch-eventsub-message-timestamp'
  ] as string;
  const rawBody = $.request.rawBody.toString();
  const hmacMessage = twitchMessageId + twitchMessageTimestamp + rawBody;
  const hash = crypto
    .createHmac('sha256', appConfig.webhookSecretKey)
    .update(hmacMessage)
    .digest('hex');
  const hmac = `sha256=${hash}`;

  const isValid = verifySignature(signature, hmac);

  return isValid;
};

const verifySignature = function (receivedSignature: string, payload: string) {
  return crypto.timingSafeEqual(
    Buffer.from(payload),
    Buffer.from(receivedSignature)
  );
};

export default verifyWebhook;
