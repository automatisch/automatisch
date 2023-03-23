import PaddleSDK from 'paddle-sdk';
import appConfig from '../../config/app';

const paddleClient = new PaddleSDK(
  appConfig.paddleVendorId.toString(),
  appConfig.paddleVendorAuthCode,
  appConfig.paddlePublicKey
);

export default paddleClient;
