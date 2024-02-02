import appConfig from '../../config/app.js';
import Billing from '../../helpers/billing/index.ee.js';

const getPaymentPlans = async () => {
  if (!appConfig.isCloud) return;

  return Billing.paddlePlans;
};

export default getPaymentPlans;
