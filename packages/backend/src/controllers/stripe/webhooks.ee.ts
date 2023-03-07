import { Response } from 'express';
import { IRequest } from '@automatisch/types';
import Billing from '../../helpers/billing/index.ee';
import appConfig from '../../config/app';
import logger from '../../helpers/logger';

export default async (request: IRequest, response: Response) => {
  const signature = request.headers['stripe-signature'];

  try {
    const event = Billing.stripe.webhooks.constructEvent(
      request.rawBody,
      signature,
      appConfig.stripeSigningSecret
    );

    await Billing.handleWebhooks(event);
    return response.sendStatus(200);
  } catch (error) {
    logger.error(`Webhook Error: ${error.message}`);
    return response.sendStatus(400);
  }
};
