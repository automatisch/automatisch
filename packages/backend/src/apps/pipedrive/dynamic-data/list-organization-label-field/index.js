export default {
  name: 'List organization label field',
  key: 'listOrganizationLabelField',

  async run($) {
    const labelFields = {
      data: [],
    };

    const { data } = await $.http.get(
      `${$.auth.data.apiDomain}/api/v1/organizationFields`
    );

    const labelField = data.data.filter((field) => field.key === 'label');
    const labelOptions = labelField[0].options;

    if (labelOptions?.length) {
      for (const label of labelOptions) {
        labelFields.data.push({
          value: label.id,
          name: label.label,
        });
      }
    }

    return labelFields;
  },
};
