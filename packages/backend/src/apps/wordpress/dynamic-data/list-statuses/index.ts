import { IGlobalVariable, IJSONObject } from '@automatisch/types';

type Status = {
  slug: string;
  name: string;
};
type Statuses = Record<string, Status>;

export default {
  name: 'List statuses',
  key: 'listStatuses',

  async run($: IGlobalVariable) {
    const statuses: {
      data: IJSONObject[];
    } = {
      data: [],
    };

    const { data } = await $.http.get<Statuses>('?rest_route=/wp/v2/statuses');

    if (!data) return statuses;

    const values = Object.values(data);

    if (!values?.length) return statuses;

    for (const status of values) {
      statuses.data.push({
        value: status.slug,
        name: status.name,
      });
    }

    return statuses;
  },
};
