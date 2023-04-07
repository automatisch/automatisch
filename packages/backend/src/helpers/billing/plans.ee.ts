const plans = [
  {
    name: '10k - monthly',
    limit: '10,000',
    quota: 10000,
    price: '€20',
    productId: '47384',
  }
];

export function getPlanById(id: string) {
  return plans.find((plan) => plan.productId === id);
}

export default plans;
