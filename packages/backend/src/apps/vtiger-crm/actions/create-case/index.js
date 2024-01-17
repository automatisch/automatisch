import defineAction from '../../../../helpers/define-action.js';
import { fields } from './fields.js';

export default defineAction({
  name: 'Create case',
  key: 'createCase',
  description: 'Create a new case.',
  arguments: fields,

  async run($) {
    const {
      summary,
      recordCurrency,
      caseTitle,
      status,
      priority,
      contactName,
      organizationName,
      group,
      assignedTo,
      productName,
      channel,
      resolution,
      category,
      subCategory,
      resolutionType,
      deferredDate,
      serviceContracts,
      asset,
      slaName,
      isBillable,
      service,
      rate,
      serviceType,
      serviceLocation,
      workLocation,
    } = $.step.parameters;

    const elementData = {
      description: summary,
      record_currency_id: recordCurrency,
      title: caseTitle,
      casestatus: status,
      casepriority: priority,
      contact_id: contactName,
      parent_id: organizationName,
      group_id: group,
      assigned_user_id: assignedTo,
      product_id: productName,
      casechannel: channel,
      resolution: resolution,
      impact_type: category,
      impact_area: subCategory,
      resolution_type: resolutionType,
      deferred_date: deferredDate,
      servicecontract_id: serviceContracts,
      asset_id: asset,
      slaid: slaName,
      is_billable: isBillable,
      billing_service: service,
      rate: rate,
      servicetype: serviceType,
      servicelocation: serviceLocation,
      work_location: workLocation,
    };

    const body = {
      operation: 'create',
      sessionName: $.auth.data.sessionName,
      element: JSON.stringify(elementData),
      elementType: 'Cases',
    };

    const response = await $.http.post('/webservice.php', body);

    $.setActionItem({ raw: response.data });
  },
});
