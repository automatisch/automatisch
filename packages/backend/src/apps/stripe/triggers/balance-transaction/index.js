import defineTrigger from '../../../../helpers/define-trigger.js';
import getBalanceTransactions from './get-balance-transactions.js';

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
