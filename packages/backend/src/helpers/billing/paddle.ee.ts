import axios from 'axios';
import appConfig from '../../config/app';

const PADDLE_VENDOR_URL = appConfig.isDev
  ? 'https://sandbox-vendors.paddle.com'
  : 'https://vendors.paddle.com';

const axiosInstance = axios.create({ baseURL: PADDLE_VENDOR_URL });

const getSubscription = async (subscriptionId: number) => {
  const data = {
    vendor_id: appConfig.paddleVendorId,
    vendor_auth_code: appConfig.paddleVendorAuthCode,
    subscription_id: subscriptionId,
  };

  const response = await axiosInstance.post(
    '/api/2.0/subscription/users',
    data
  );
  const subscription = response.data.response[0];
  return subscription;
};

const paddleClient = {
  getSubscription,
};

export default paddleClient;
