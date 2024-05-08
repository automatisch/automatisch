import { DateTime } from 'luxon';
import defineTrigger from '../../../../helpers/define-trigger.js';

export default defineTrigger({
  name: 'Low account balance',
  key: 'lowAccountBalance',
  pollInterval: 15,
  description:
    'Triggers when the balance of a Checking or Savings account falls below a specified amount within a given month.',
  arguments: [
    {
      label: 'Balance Below Amount',
      key: 'balanceBelowAmount',
      type: 'string',
      required: true,
      description: 'Account balance falls below this amount (e.g. "250.00")',
      variables: true,
    },
  ],

  async run($) {
    const monthYear = DateTime.now().toFormat('MM-yyyy');
    const balanceBelowAmount = $.step.parameters.balanceBelowAmount;
    const formattedBalance = balanceBelowAmount * 1000;

    const response = await $.http.get('/budgets/default/accounts');

    if (response.data?.data?.accounts?.length) {
      for (const account of response.data.data.accounts) {
        if (account.balance < formattedBalance) {
          $.pushTriggerItem({
            raw: account,
            meta: {
              internalId: `${account.id}-${monthYear}`,
            },
          });
        }
      }
    }
  },
});
