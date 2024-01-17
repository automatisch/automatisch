export default {
  name: 'List lead options',
  key: 'listLeadOptions',

  async run($) {
    const leadOptions = {
      data: [],
    };
    const {
      designation,
      industry,
      leadSource,
      leadStatus,
      emailOptin,
      smsOptin,
      language,
      country,
      state,
    } = $.step.parameters;

    const picklistFields = [
      designation,
      industry,
      leadSource,
      leadStatus,
      emailOptin,
      smsOptin,
      language,
      country,
      state,
    ];

    const params = {
      operation: 'describe',
      sessionName: $.auth.data.sessionName,
      elementType: 'Leads',
    };

    const { data } = await $.http.get(`/webservice.php`, { params });

    if (data.result.fields?.length) {
      for (const field of data.result.fields) {
        if (picklistFields.includes(field.name)) {
          field.type.picklistValues.map((item) =>
            leadOptions.data.push({
              value: item.value,
              name: item.label,
            })
          );
        }
      }
    }

    return leadOptions;
  },
};
