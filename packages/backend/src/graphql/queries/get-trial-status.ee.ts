import appConfig from '../../config/app';
import Context from '../../types/express/context';

const getTrialStatus = async (
  _parent: unknown,
  _params: unknown,
  context: Context
) => {
  if (!appConfig.isCloud) return;

  const inTrial = await context.currentUser.inTrial();
  const hasActiveSubscription = await context.currentUser.hasActiveSubscription();

  if (!inTrial && hasActiveSubscription) return;

  return {
    expireAt: context.currentUser.trialExpiryDate,
  };
};

export default getTrialStatus;
