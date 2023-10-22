import defineAction from '../../../../helpers/define-action';
import { filterProvidedFields } from '../../common/filter-provided-fields';
import { fields } from './fields';

export default defineAction({
  name: 'Create product',
  key: 'createProduct',
  description: 'Creates a new product.',
  arguments: fields,

  async run($) {
    const {
      productKey,
      notes,
      price,
      quantity,
      taxRate1,
      taxName1,
      taxRate2,
      taxName2,
      taxRate3,
      taxName3,
      customValue1,
      customValue2,
      customValue3,
      customValue4,
    } = $.step.parameters;

    const bodyFields = {
      product_key: productKey,
      notes: notes,
      price: price,
      quantity: quantity,
      tax_rate1: taxRate1,
      tax_name1: taxName1,
      tax_rate2: taxRate2,
      tax_name2: taxName2,
      tax_rate3: taxRate3,
      tax_name3: taxName3,
      custom_value1: customValue1,
      custom_value2: customValue2,
      custom_value3: customValue3,
      custom_value4: customValue4,
    };

    const body = filterProvidedFields(bodyFields);

    const response = await $.http.post('/v1/products', body);

    $.setActionItem({ raw: response.data.data });
  },
});
