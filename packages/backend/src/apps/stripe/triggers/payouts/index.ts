import defineTrigger from "../../../../helpers/define-trigger";
import getPayouts from "../../common/get-payouts";

export default defineTrigger({
    name: 'Payout',
    key: 'payout',
    description: 'Triggers when a payout (Stripe <-> Bank account) has been updated',
    pollInterval: 15,
    async run($) {
        await getPayouts($)
    }
})