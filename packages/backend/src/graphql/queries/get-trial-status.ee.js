import appConfig from '../../config/app';

const getTrialStatus = async (_parent, _params, context) => {
  if (!appConfig.isCloud) return;

  const inTrial = await context.currentUser.inTrial();
  const hasActiveSubscription =
    await context.currentUser.hasActiveSubscription();

  if (!inTrial && hasActiveSubscription) return;

  return {
    expireAt: context.currentUser.trialExpiryDate,
  };
};

export default getTrialStatus;
