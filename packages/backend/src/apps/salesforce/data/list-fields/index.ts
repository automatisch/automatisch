import { IGlobalVariable } from '@automatisch/types';

type TResponse = {
  fields: TField[];
};

type TField = {
  name: string;
  label: string;
};

export default {
  name: 'List fields',
  key: 'listFields',

  async run($: IGlobalVariable) {
    const { object } = $.step.parameters;

    if (!object) return { data: [] };

    const response = await $.http.get<TResponse>(
      `/services/data/v56.0/sobjects/${object}/describe`
    );

    const fields = response.data.fields.map((field) => {
      return {
        value: field.name,
        name: field.label,
      };
    });

    return { data: fields };
  },
};
