import crypto from 'crypto';

import appConfig from '../../../config/app.js';

const verifyWebhook = async ($) => {
  const signature = $.request.headers['typeform-signature'];
  const isValid = verifySignature(signature, $.request.rawBody.toString());

  return isValid;
};

const verifySignature = function (receivedSignature, payload) {
  const hash = crypto
    .createHmac('sha256', appConfig.webhookSecretKey)
    .update(payload)
    .digest('base64');
  return receivedSignature === `sha256=${hash}`;
};

export default verifyWebhook;
