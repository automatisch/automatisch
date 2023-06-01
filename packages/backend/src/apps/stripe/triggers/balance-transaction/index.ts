import defineTrigger from '../../../../helpers/define-trigger';
import getBalanceTransactions from './get-balance-transactions';

export default defineTrigger({
  name: 'New balance transactions',
  key: 'newBalanceTransactions',
  description:
    'Triggers when a new transaction is processed (refund, payout, adjustment, ...)',
  pollInterval: 15,
  async run($) {
    await getBalanceTransactions($);
  },
});
