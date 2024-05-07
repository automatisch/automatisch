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
      recordCurrencyId,
      caseTitle,
      status,
      priority,
      contactId,
      organizationId,
      groupId,
      assignedTo,
      productId,
      channel,
      resolution,
      category,
      subCategory,
      resolutionType,
      deferredDate,
      serviceContractId,
      assetId,
      slaId,
      isBillable,
      service,
      rate,
      serviceType,
      serviceLocation,
      workLocation,
    } = $.step.parameters;

    const elementData = {
      description: summary,
      record_currency_id: recordCurrencyId,
      title: caseTitle,
      casestatus: status,
      casepriority: priority,
      contact_id: contactId,
      parent_id: organizationId,
      group_id: groupId,
      assigned_user_id: assignedTo,
      product_id: productId,
      casechannel: channel,
      resolution: resolution,
      impact_type: category,
      impact_area: subCategory,
      resolution_type: resolutionType,
      deferred_date: deferredDate,
      servicecontract_id: serviceContractId,
      asset_id: assetId,
      slaid: slaId,
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
