import { renderObject } from '../../../../helpers/renderer.js';

export default async (request, response) => {
  const inTrial = await request.currentUser.inTrial();

  const trialInfo = {
    inTrial,
    expireAt: request.currentUser.trialExpiryDate,
  };

  renderObject(response, trialInfo);
};
