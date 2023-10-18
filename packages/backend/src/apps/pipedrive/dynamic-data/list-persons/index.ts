import { IGlobalVariable, IJSONObject } from '@automatisch/types';

export default {
  name: 'List persons',
  key: 'listPersons',

  async run($: IGlobalVariable) {
    const persons: {
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
        `${$.auth.data.apiDomain}/api/v1/persons`,
        { params }
      );
      params.start = data.additional_data?.pagination?.next_start;

      if (data.data?.length) {
        for (const person of data.data) {
          persons.data.push({
            value: person.id,
            name: person.name,
          });
        }
      }
    } while (params.start);
    return persons;
  },
};
