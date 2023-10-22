import { IGlobalVariable, IJSONObject } from '@automatisch/types';

export default {
  name: 'List person label field',
  key: 'listPersonLabelField',

  async run($: IGlobalVariable) {
    const personFields: {
      data: IJSONObject[];
    } = {
      data: [],
    };

    const params = {
      start: 0,
      limit: 100,
    };

    do {
      const { data } = await $.http.get(
        `${$.auth.data.apiDomain}/api/v1/personFields`,
        { params }
      );
      params.start = data.additional_data?.pagination?.next_start;

      const labelField = data.data?.filter(
        (personField: IJSONObject) => personField.key === 'label'
      );
      const labelOptions = labelField[0].options;

      if (labelOptions?.length) {
        for (const label of labelOptions) {
          personFields.data.push({
            value: label.id,
            name: label.label,
          });
        }
      }
    } while (params.start);
    return personFields;
  },
};
