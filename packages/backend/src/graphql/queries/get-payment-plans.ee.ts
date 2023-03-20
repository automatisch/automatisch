import appConfig from '../../config/app';
import Billing from '../../helpers/billing/index.ee';

const getPaymentPlans = async () => {
  if (!appConfig.isCloud) return;

  return Billing.paddlePlans;
};

export default getPaymentPlans;
