export default {
  name: 'List case options',
  key: 'listCaseOptions',

  async run($) {
    const caseOptions = {
      data: [],
    };
    const {
      status,
      priority,
      contactName,
      productName,
      channel,
      category,
      subCategory,
      resolutionType,
      serviceType,
      serviceLocation,
    } = $.step.parameters;

    const picklistFields = [
      status,
      priority,
      contactName,
      productName,
      channel,
      category,
      subCategory,
      resolutionType,
      serviceType,
      serviceLocation,
    ];

    const params = {
      operation: 'describe',
      sessionName: $.auth.data.sessionName,
      elementType: 'Cases',
    };

    const { data } = await $.http.get(`/webservice.php`, { params });

    if (data.result.fields?.length) {
      for (const field of data.result.fields) {
        if (picklistFields.includes(field.name)) {
          field.type.picklistValues.map((item) =>
            caseOptions.data.push({
              value: item.value,
              name: item.label,
            })
          );
        }
      }
    }

    return caseOptions;
  },
};
