import defineAction from '../../../../helpers/define-action.js';
import { fields } from './fields.js';

export default defineAction({
  name: 'Create opportunity',
  key: 'createOpportunity',
  description: 'Create a new opportunity.',
  arguments: fields,

  async run($) {
    const {
      dealName,
      amount,
      organizationName,
      contactName,
      expectedCloseDate,
      pipeline,
      salesStage,
      assignedTo,
      leadSource,
      nextStep,
      type,
      probability,
      campaignSource,
      weightedRevenue,
      adjustedAmount,
      lostReason,
      recordCurrency,
      description,
    } = $.step.parameters;

    const elementData = {
      potentialname: dealName,
      amount,
      related_to: organizationName,
      contact_id: contactName,
      closingdate: expectedCloseDate,
      pipeline,
      sales_stage: salesStage,
      assigned_user_id: assignedTo || $.auth.data.userId,
      leadsource: leadSource,
      nextstep: nextStep,
      opportunity_type: type,
      probability: probability,
      campaignid: campaignSource,
      forecast_amount: weightedRevenue,
      adjusted_amount: adjustedAmount,
      lost_reason: lostReason,
      record_currency_id: recordCurrency,
      description,
    };

    const body = {
      operation: 'create',
      sessionName: $.auth.data.sessionName,
      element: JSON.stringify(elementData),
      elementType: 'Potentials',
    };

    const response = await $.http.post('/webservice.php', body);

    $.setActionItem({ raw: response.data });
  },
});
