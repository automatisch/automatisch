import appConfig from '../../config/app';
import Billing from '../../helpers/billing/index.ee';

const getPaddleInfo = async () => {
  if (!appConfig.isCloud) return;

  return Billing.paddleInfo;
};

export default getPaddleInfo;
