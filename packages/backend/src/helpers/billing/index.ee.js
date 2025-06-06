import appConfig from '@/config/app.js';
import paddleClient from '@/helpers/billing/paddle.ee.js';
import paddlePlans from '@/helpers/billing/plans.ee.js';
import webhooks from '@/helpers/billing/webhooks.ee.js';

const paddleInfo = {
  sandbox: appConfig.isProd ? false : true,
  vendorId: appConfig.paddleVendorId,
};

const billing = {
  paddleClient,
  paddlePlans,
  paddleInfo,
  webhooks,
};

export default billing;
