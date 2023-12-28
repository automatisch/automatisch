import appConfig from '../../config/app';

const getSubscriptionStatus = async (_parent, _params, context) => {
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
