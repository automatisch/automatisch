import defineAction from '../../../../helpers/define-action';
import { filterProvidedFields } from '../../common/filter-provided-fields';
import { fields } from './fields';

export default defineAction({
  name: 'Create client',
  key: 'createClient',
  description: 'Creates a new client.',
  arguments: fields,

  async run($) {
    const {
      clientName,
      contactFirstName,
      contactLastName,
      contactEmail,
      contactPhone,
      languageCode,
      currencyCode,
      idNumber,
      vatNumber,
      streetAddress,
      aptSuite,
      city,
      stateProvince,
      postalCode,
      countryCode,
      shippingStreetAddress,
      shippingAptSuite,
      shippingCity,
      shippingStateProvince,
      shippingPostalCode,
      shippingCountryCode,
      privateNotes,
      publicNotes,
      website,
      customValue1,
      customValue2,
      customValue3,
      customValue4,
    } = $.step.parameters;

    const bodyFields = {
      name: clientName,
      contacts: {
        first_name: contactFirstName,
        last_name: contactLastName,
        email: contactEmail,
        phone: contactPhone,
      },
      settings: {
        language_id: languageCode,
        currency_id: currencyCode,
      },
      id_number: idNumber,
      vat_number: vatNumber,
      address1: streetAddress,
      address2: aptSuite,
      city: city,
      state: stateProvince,
      postal_code: postalCode,
      country_id: countryCode,
      shipping_address1: shippingStreetAddress,
      shipping_address2: shippingAptSuite,
      shipping_city: shippingCity,
      shipping_state: shippingStateProvince,
      shipping_postal_code: shippingPostalCode,
      shipping_country_id: shippingCountryCode,
      private_notes: privateNotes,
      public_notes: publicNotes,
      website: website,
      custom_value1: customValue1,
      custom_value2: customValue2,
      custom_value3: customValue3,
      custom_value4: customValue4,
    };

    const body = filterProvidedFields(bodyFields);

    const response = await $.http.post('/v1/clients', body);

    $.setActionItem({ raw: response.data.data });
  },
});
