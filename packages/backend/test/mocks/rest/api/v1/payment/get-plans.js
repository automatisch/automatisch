const getPaymentPlansMock = async () => {
  return {
    data: [
      {
        limit: '10,000',
        name: '10k - monthly',
        price: '€20',
        productId: '47384',
        quota: 10000,
      },
    ],
    meta: {
      count: 1,
      currentPage: null,
      isArray: true,
      totalPages: null,
      type: 'Object',
    },
  };
};

export default getPaymentPlansMock;
