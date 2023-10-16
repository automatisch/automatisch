import defineAction from '../../../../helpers/define-action';
import { filterProvidedFields } from '../../common/filter-provided-fields';
import { fields } from './fields';

export default defineAction({
  name: 'Create invoice',
  key: 'createInvoice',
  description: 'Creates a new invoice.',
  arguments: fields,

  async run($) {
    const {
      clientId,
      sendEmail,
      markSent,
      paid,
      amountPaid,
      number,
      discount,
      poNumber,
      date,
      dueDate,
      taxRate1,
      taxName1,
      taxRate2,
      taxName2,
      taxRate3,
      taxName3,
      customField1,
      customField2,
      customField3,
      customField4,
      customSurcharge1,
      customSurcharge2,
      customSurcharge3,
      customSurcharge4,
      isAmountDiscount,
      partialDeposit,
      partialDueDate,
      lineItemCost,
      lineItemQuantity,
      lineItemProduct,
      lineItemDiscount,
      lineItemDescription,
      lineItemTaxRate1,
      lineItemTaxName1,
      lineItemTaxRate2,
      lineItemTaxName2,
      lineItemTaxRate3,
      lineItemTaxName3,
      lineItemCustomField1,
      lineItemCustomField2,
      lineItemCustomField3,
      lineItemCustomField4,
      lineItemProductCost,
      publicNotes,
      privateNotes,
      terms,
      footer,
    } = $.step.parameters;

    const paramFields = {
      send_email: sendEmail,
      mark_sent: markSent,
      paid: paid,
      amount_paid: amountPaid,
    };

    const params = filterProvidedFields(paramFields);

    const bodyFields = {
      client_id: clientId,
      number: number,
      discount: discount,
      po_number: poNumber,
      date: date,
      due_date: dueDate,
      tax_rate1: taxRate1,
      tax_name1: taxName1,
      tax_rate2: taxRate2,
      tax_name2: taxName2,
      tax_rate3: taxRate3,
      tax_name3: taxName3,
      custom_value1: customField1,
      custom_value2: customField2,
      custom_value3: customField3,
      custom_value4: customField4,
      custom_surcharge1: customSurcharge1,
      custom_surcharge2: customSurcharge2,
      custom_surcharge3: customSurcharge3,
      custom_surcharge4: customSurcharge4,
      is_amount_discount: Boolean(isAmountDiscount),
      partial: partialDeposit,
      partial_due_date: partialDueDate,
      line_items: [
        {
          cost: lineItemCost,
          quantity: lineItemQuantity,
          product_key: lineItemProduct,
          discount: lineItemDiscount,
          notes: lineItemDescription,
          tax_rate1: lineItemTaxRate1,
          tax_name1: lineItemTaxName1,
          tax_rate2: lineItemTaxRate2,
          tax_name2: lineItemTaxName2,
          tax_rate3: lineItemTaxRate3,
          tax_name3: lineItemTaxName3,
          custom_value1: lineItemCustomField1,
          custom_value2: lineItemCustomField2,
          custom_value3: lineItemCustomField3,
          custom_value4: lineItemCustomField4,
          product_cost: lineItemProductCost,
        },
      ],
      public_notes: publicNotes,
      private_notes: privateNotes,
      terms: terms,
      footer: footer,
    };

    const body = filterProvidedFields(bodyFields);

    const response = await $.http.post('/v1/invoices', body, { params });

    $.setActionItem({ raw: response.data.data });
  },
});
