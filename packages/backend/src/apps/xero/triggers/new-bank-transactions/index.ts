import defineTrigger from '../../../../helpers/define-trigger';

export default defineTrigger({
  name: 'New bank transactions',
  key: 'newBankTransactions',
  pollInterval: 15,
  description: 'Triggers when a new bank transaction occurs.',
  arguments: [
    {
      label: 'Organization',
      key: 'organizationId',
      type: 'dropdown' as const,
      required: true,
      description: '',
      variables: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listOrganizations',
          },
        ],
      },
    },
  ],

  async run($) {
    const params = {
      page: 1,
      order: 'Date DESC',
    };

    let nextPage = false;
    do {
      const { data } = await $.http.get('/api.xro/2.0/BankTransactions', {
        params,
      });
      params.page = params.page + 1;

      if (data.BankTransactions?.length) {
        for (const bankTransaction of data.BankTransactions) {
          $.pushTriggerItem({
            raw: bankTransaction,
            meta: {
              internalId: bankTransaction.BankTransactionID,
            },
          });
        }
      }

      if (data.BankTransactions?.length === 100) {
        nextPage = true;
      } else {
        nextPage = false;
      }
    } while (nextPage);
  },
});
