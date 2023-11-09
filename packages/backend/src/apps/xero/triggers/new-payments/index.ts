import defineTrigger from '../../../../helpers/define-trigger';

type Params = {
  page: number;
  order: string;
  where?: string;
};

export default defineTrigger({
  name: 'New payments',
  key: 'newPayments',
  pollInterval: 15,
  description: 'Triggers when a new payment is received.',
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
    {
      label: 'Payment Type',
      key: 'paymentType',
      type: 'dropdown' as const,
      required: false,
      description: '',
      variables: true,
      value: '',
      options: [
        { label: 'Accounts Receivable', value: 'ACCRECPAYMENT' },
        { label: 'Accounts Payable', value: 'ACCPAYPAYMENT' },
        {
          label: 'Accounts Receivable Credit (Refund)',
          value: 'ARCREDITPAYMENT',
        },
        {
          label: 'Accounts Payable Credit (Refund)',
          value: 'APCREDITPAYMENT',
        },
        {
          label: 'Accounts Receivable Overpayment (Refund)',
          value: 'AROVERPAYMENTPAYMENT',
        },
        {
          label: 'Accounts Receivable Prepayment (Refund)',
          value: 'ARPREPAYMENTPAYMENT',
        },
        {
          label: 'Accounts Payable Prepayment (Refund)',
          value: 'APPREPAYMENTPAYMENT',
        },
        {
          label: 'Accounts Payable Overpayment (Refund)',
          value: 'APOVERPAYMENTPAYMENT',
        },
      ],
    },
  ],

  async run($) {
    const paymentType = $.step.parameters.paymentType;

    const params: Params = {
      page: 1,
      order: 'Date DESC',
    };

    if (paymentType) {
      params.where = `PaymentType="${paymentType}"`;
    }

    let nextPage = false;
    do {
      const { data } = await $.http.get('/api.xro/2.0/Payments', {
        params,
      });
      params.page = params.page + 1;

      if (data.Payments?.length) {
        for (const payment of data.Payments) {
          $.pushTriggerItem({
            raw: payment,
            meta: {
              internalId: payment.PaymentID,
            },
          });
        }
      }

      if (data.Payments?.length === 100) {
        nextPage = true;
      } else {
        nextPage = false;
      }
    } while (nextPage);
  },
});
