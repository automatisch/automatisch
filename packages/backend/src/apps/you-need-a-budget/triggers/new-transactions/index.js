import defineTrigger from '../../../../helpers/define-trigger.js';

export default defineTrigger({
  name: 'New transactions',
  key: 'newTransactions',
  pollInterval: 15,
  description: 'Triggers when a new transaction is created.',

  async run($) {
    const response = await $.http.get('/budgets/default/transactions');
    const transactions = response.data.data?.transactions;

    if (transactions?.length) {
      for (const transaction of transactions) {
        $.pushTriggerItem({
          raw: transaction,
          meta: {
            internalId: transaction.id,
          },
        });
      }
    }
  },
});
