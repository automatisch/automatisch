import appConfig from '../../config/app';
import paddleClient from './paddle.ee';
import paddlePlans from './plans.ee';

const paddleInfo = {
  sandbox: appConfig.isDev ? true : false,
  vendorId: appConfig.paddleVendorId,
};

const billing = {
  paddleClient,
  paddlePlans,
  paddleInfo,
};

export default billing;
