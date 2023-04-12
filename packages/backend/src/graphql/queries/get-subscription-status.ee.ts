import appConfig from '../../config/app';
import Context from '../../types/express/context';

const getSubscriptionStatus = async (
  _parent: unknown,
  _params: unknown,
  context: Context
) => {
  if (!appConfig.isCloud) return;

  const currentSubscription = await context.currentUser.$relatedQuery(
    'currentSubscription'
  );

  if (!currentSubscription?.cancellationEffectiveDate) return;

  return {
    cancellationEffectiveDate: currentSubscription.cancellationEffectiveDate,
  };
};

export default getSubscriptionStatus;
