const subscriptinSerializer = (subscription) => {
  let userData = {
    id: subscription.id,
    paddleSubscriptionId: subscription.paddleSubscriptionId,
    paddlePlanId: subscription.paddlePlanId,
    updateUrl: subscription.updateUrl,
    cancelUrl: subscription.cancelUrl,
    status: subscription.status,
    nextBillAmount: subscription.nextBillAmount,
    nextBillDate: subscription.nextBillDate,
    lastBillDate: subscription.lastBillDate,
    createdAt: subscription.createdAt.getTime(),
    updatedAt: subscription.updatedAt.getTime(),
    cancellationEffectiveDate: subscription.cancellationEffectiveDate,
  };

  return userData;
};

export default subscriptinSerializer;
