import appConfig from '../../config/app.js';
import paddleClient from './paddle.ee.js';
import paddlePlans from './plans.ee.js';
import webhooks from './webhooks.ee.js';

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
