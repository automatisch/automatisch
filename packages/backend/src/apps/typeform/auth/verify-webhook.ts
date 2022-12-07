import crypto from 'crypto';
import { IGlobalVariable } from '@automatisch/types';
import appConfig from '../../../config/app';

const verifyWebhook = async ($: IGlobalVariable) => {
  const signature = $.request.headers['typeform-signature'] as string;
  const isValid = verifySignature(signature, $.request.rawBody.toString());

  return isValid;
};

const verifySignature = function (receivedSignature: string, payload: string) {
  const hash = crypto
    .createHmac('sha256', appConfig.webhookSecretKey)
    .update(payload)
    .digest('base64');
  return receivedSignature === `sha256=${hash}`;
};

export default verifyWebhook;
