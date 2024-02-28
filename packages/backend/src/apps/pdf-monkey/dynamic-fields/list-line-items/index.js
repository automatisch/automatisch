export default {
  name: 'List line items',
  key: 'listLineItems',

  async run($) {
    if ($.step.parameters.addLineItems) {
      return [
        {
          label: 'Line Items',
          key: 'lineItems',
          type: 'dynamic',
          required: false,
          description:
            'Data for a single item. Available as "lineItems" in your PDFMonkey Template.',
          fields: [
            {
              label: 'Key',
              key: 'lineItemKey',
              type: 'string',
              required: false,
              description: '',
              variables: true,
            },
            {
              label: 'Value',
              key: 'lineItemValue',
              type: 'string',
              required: false,
              description: '',
              variables: true,
            },
          ],
        },
      ];
    }
  },
};
