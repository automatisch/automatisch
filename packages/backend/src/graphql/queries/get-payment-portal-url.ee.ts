import appConfig from '../../config/app';
import Context from '../../types/express/context';
import Billing from '../../helpers/billing/index.ee';

const getPaymentPortalUrl = async (
  _parent: unknown,
  _params: unknown,
  context: Context
) => {
  if (!appConfig.isCloud) return;

  const url = Billing.createPaymentPortalUrl(context.currentUser);
  return { url };
};

export default getPaymentPortalUrl;
