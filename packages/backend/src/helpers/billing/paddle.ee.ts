// TODO: replace with axios-with-proxy when needed
import axios from 'axios';
import appConfig from '../../config/app';
import { DateTime } from 'luxon';

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

const getInvoices = async (subscriptionId: number) => {
  // TODO: iterate over previous subscriptions and include their invoices
  const data = {
    vendor_id: appConfig.paddleVendorId,
    vendor_auth_code: appConfig.paddleVendorAuthCode,
    subscription_id: subscriptionId,
    is_paid: 1,
    from: DateTime.now().minus({ years: 3 }).toISODate(),
    to: DateTime.now().plus({ days: 3 }).toISODate(),
  };

  const response = await axiosInstance.post(
    '/api/2.0/subscription/payments',
    data
  );

  const invoices = response.data.response;

  return invoices;
};

const paddleClient = {
  getSubscription,
  getInvoices,
};

export default paddleClient;
