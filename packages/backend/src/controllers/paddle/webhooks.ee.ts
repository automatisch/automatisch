import { Response } from 'express';
import { IRequest } from '@automatisch/types';
import Billing from '../../helpers/billing/index.ee';

export default async (request: IRequest, response: Response) => {
  const isVerified = Billing.paddleClient.verifyWebhookData(request.body);

  if (!isVerified) {
    return response.sendStatus(401);
  }

  if (request.body.alert_name === 'subscription_created') {
    await Billing.webhooks.handleSubscriptionCreated(request);
  }

  return response.sendStatus(200);
};
