import appConfig from '../../config/app';
import paddleClient from './paddle.ee';
import paddlePlans from './plans.ee';
import webhooks from './webhooks.ee';

const paddleInfo = {
  sandbox: appConfig.isDev ? true : false,
  vendorId: appConfig.paddleVendorId,
};

const billing = {
  paddleClient,
  paddlePlans,
  paddleInfo,
  webhooks,
};

export default billing;
