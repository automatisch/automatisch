import defineTrigger from "../../../../helpers/define-trigger";
import getBalanceTransactions from "../../common/get-balance-transactions";

export default defineTrigger({
    name: 'Balance Transaction',
    key: 'balanceTransaction',
    description: 'Triggers when a new transaction is processed (refund, payout, adjustment, ...)',
    pollInterval: 15,
    async run($) {
        await getBalanceTransactions($)
    }
})