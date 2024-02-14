import { renderObject } from '../../../../helpers/renderer.js';

export default async (request, response) => {
  const inTrial = await request.currentUser.inTrial();

  const hasActiveSubscription =
    await request.currentUser.hasActiveSubscription();

  const trialInfo = {
    inTrial,
    hasActiveSubscription,
    expireAt: request.currentUser.trialExpiryDate,
  };

  renderObject(response, trialInfo);
};
