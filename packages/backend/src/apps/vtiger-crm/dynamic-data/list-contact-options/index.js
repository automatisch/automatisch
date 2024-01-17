export default {
  name: 'List contact options',
  key: 'listContactOptions',

  async run($) {
    const leadOptions = {
      data: [],
    };
    const {
      leadSource,
      lifecycleStage,
      status,
      title,
      happinessRating,
      emailOptin,
      smsOptin,
      language,
      otherCountry,
      mailingCountry,
      mailingState,
      otherState,
    } = $.step.parameters;

    const picklistFields = [
      leadSource,
      lifecycleStage,
      status,
      title,
      happinessRating,
      emailOptin,
      smsOptin,
      language,
      otherCountry,
      mailingCountry,
      mailingState,
      otherState,
    ];

    const params = {
      operation: 'describe',
      sessionName: $.auth.data.sessionName,
      elementType: 'Contacts',
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
