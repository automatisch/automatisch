import appConfig from '../../config/app';
import paddlePlans from './plans.ee';

const paddleInfo = {
  sandbox: appConfig.isDev ? true : false,
  vendorId: appConfig.paddleVendorId,
};

const billing = {
  paddlePlans,
  paddleInfo,
};

export default billing;
