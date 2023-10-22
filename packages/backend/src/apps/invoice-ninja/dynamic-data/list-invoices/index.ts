import { IGlobalVariable, IJSONObject } from '@automatisch/types';

export default {
  name: 'List invoices',
  key: 'listInvoices',

  async run($: IGlobalVariable) {
    const invoices: {
      data: IJSONObject[];
    } = {
      data: [],
    };

    const params = {
      sort: 'created_at|desc',
    };

    const {
      data: { data },
    } = await $.http.get('/v1/invoices', { params });

    if (!data?.length) {
      return;
    }

    for (const invoice of data) {
      invoices.data.push({
        value: invoice.id,
        name: invoice.number,
      });
    }

    return invoices;
  },
};
