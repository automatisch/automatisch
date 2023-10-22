import defineAction from '../../../../helpers/define-action';
import { filterProvidedFields } from '../../common/filter-provided-fields';
import { fields } from './fields';

export default defineAction({
  name: 'Create payment',
  key: 'createPayment',
  description: 'Creates a new payment.',
  arguments: fields,

  async run($) {
    const {
      clientId,
      paymentDate,
      invoiceId,
      invoiceAmount,
      paymentType,
      transferReference,
      privateNotes,
    } = $.step.parameters;

    const bodyFields = {
      client_id: clientId,
      date: paymentDate,
      invoices: [
        {
          invoice_id: invoiceId,
          amount: invoiceAmount,
        },
      ],
      type_id: paymentType,
      transaction_reference: transferReference,
      private_notes: privateNotes,
    };

    const body = filterProvidedFields(bodyFields);

    const response = await $.http.post('/v1/payments', body);

    $.setActionItem({ raw: response.data.data });
  },
});
