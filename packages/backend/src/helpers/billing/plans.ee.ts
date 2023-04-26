import appConfig from '../../config/app';

const testPlans = [
  {
    name: '10k - monthly',
    limit: '10,000',
    quota: 10000,
    price: '€20',
    productId: '47384',
  },
];

const prodPlans = [
  {
    name: '10k - monthly',
    limit: '10,000',
    quota: 10000,
    price: '€20',
    productId: '826658',
  },
];

const plans = appConfig.isProd ? prodPlans : testPlans;

export function getPlanById(id: string) {
  return plans.find((plan) => plan.productId === id);
}

export default plans;
