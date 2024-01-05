import defineTrigger from '../../../../helpers/define-trigger.js';
import getPayouts from './get-payouts.js';

export default defineTrigger({
  name: 'New payouts',
  key: 'newPayouts',
  description:
    'Triggers when a payout (Stripe <-> Bank account) has been updated',
  pollInterval: 15,
  async run($) {
    await getPayouts($);
  },
});
