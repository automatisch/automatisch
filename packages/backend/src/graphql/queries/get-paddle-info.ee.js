import appConfig from '../../config/app.js';
import Billing from '../../helpers/billing/index.ee.js';

const getPaddleInfo = async () => {
  if (!appConfig.isCloud) return;

  return Billing.paddleInfo;
};

export default getPaddleInfo;
