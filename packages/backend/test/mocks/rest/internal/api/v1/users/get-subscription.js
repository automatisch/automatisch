const getSubscriptionMock = (subscription) => {
  return {
    data: {
      id: subscription.id,
      paddlePlanId: subscription.paddlePlanId,
      paddleSubscriptionId: subscription.paddleSubscriptionId,
      cancelUrl: subscription.cancelUrl,
      updateUrl: subscription.updateUrl,
      status: subscription.status,
      nextBillAmount: subscription.nextBillAmount,
      nextBillDate: subscription.nextBillDate.toISOString(),
      lastBillDate: subscription.lastBillDate,
      cancellationEffectiveDate: subscription.cancellationEffectiveDate,
      createdAt: subscription.createdAt.getTime(),
      updatedAt: subscription.updatedAt.getTime(),
    },
    meta: {
      count: 1,
      currentPage: null,
      isArray: false,
      totalPages: null,
      type: 'Subscription',
    },
  };
};

export default getSubscriptionMock;
