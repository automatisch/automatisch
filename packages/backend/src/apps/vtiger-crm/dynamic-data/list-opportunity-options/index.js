export default {
  name: 'List opportunity options',
  key: 'listOpportunityOptions',

  async run($) {
    const opportunityOptions = {
      data: [],
    };
    const leadSource = $.step.parameters.leadSource;
    const lostReason = $.step.parameters.lostReason;
    const type = $.step.parameters.type;
    const salesStage = $.step.parameters.salesStage;
    const picklistFields = [leadSource, lostReason, type, salesStage];

    const params = {
      operation: 'describe',
      sessionName: $.auth.data.sessionName,
      elementType: 'Potentials',
    };

    const { data } = await $.http.get(`/webservice.php`, { params });

    if (data.result.fields?.length) {
      for (const field of data.result.fields) {
        if (picklistFields.includes(field.name)) {
          field.type.picklistValues.map((item) =>
            opportunityOptions.data.push({
              value: item.value,
              name: item.label,
            })
          );
        }
      }
    }

    return opportunityOptions;
  },
};
