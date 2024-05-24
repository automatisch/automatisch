import defineAction from '../../../../helpers/define-action.js';
import { fields } from './fields.js';

export default defineAction({
  name: 'Create lead',
  key: 'createLead',
  description: 'Create a new lead.',
  arguments: fields,

  async run($) {
    const {
      salutation,
      firstName,
      lastName,
      company,
      primaryEmail,
      officePhone,
      designation,
      mobilePhone,
      industry,
      website,
      annualRevenue,
      leadSource,
      leadStatus,
      assignedTo,
      fax,
      numberOfEmployees,
      twitterUsername,
      recordCurrencyId,
      emailOptin,
      smsOptin,
      language,
      sourceCampaignId,
      country,
      street,
      poBox,
      postalCode,
      city,
      state,
      description,
      leadImage,
    } = $.step.parameters;

    const elementData = {
      salutationtype: salutation,
      firstname: firstName,
      lastname: lastName,
      company: company,
      email: primaryEmail,
      phone: officePhone,
      designation: designation,
      mobile: mobilePhone,
      industry: industry,
      website: website,
      annualrevenue: annualRevenue,
      leadsource: leadSource,
      leadstatus: leadStatus,
      assigned_user_id: assignedTo || $.auth.data.userId,
      fax: fax,
      noofemployees: numberOfEmployees,
      primary_twitter: twitterUsername,
      record_currency_id: recordCurrencyId,
      emailoptin: emailOptin,
      smsoptin: smsOptin,
      language: language,
      source_campaign: sourceCampaignId,
      country: country,
      lane: street,
      pobox: poBox,
      code: postalCode,
      city: city,
      state: state,
      description: description,
      imagename: leadImage,
    };

    const body = {
      operation: 'create',
      sessionName: $.auth.data.sessionName,
      element: JSON.stringify(elementData),
      elementType: 'Leads',
    };

    const response = await $.http.post('/webservice.php', body);

    $.setActionItem({ raw: response.data });
  },
});
