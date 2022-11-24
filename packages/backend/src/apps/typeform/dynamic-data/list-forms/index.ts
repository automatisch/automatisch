import { IGlobalVariable, IJSONObject } from '@automatisch/types';

export default {
  name: 'List forms',
  key: 'listForms',

  async run($: IGlobalVariable) {
    const forms: {
      data: IJSONObject[];
    } = {
      data: [],
    };

    const response = await $.http.get('/forms');

    forms.data = response.data.items.map((form: IJSONObject) => {
      return {
        value: form.id,
        name: form.title,
      };
    });

    return forms;
  },
};
