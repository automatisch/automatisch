import { IGlobalVariable, IJSONObject } from '@automatisch/types';

export default {
  name: 'List leads',
  key: 'listLeads',

  async run($: IGlobalVariable) {
    const leads: {
      data: IJSONObject[];
    } = {
      data: [],
    };

    const params = {
      sort: 'add_time DESC',
    };

    const { data } = await $.http.get(`${$.auth.data.apiDomain}/api/v1/leads`, {
      params,
    });

    if (data.data?.length) {
      for (const lead of data.data) {
        leads.data.push({
          value: lead.id,
          name: lead.title,
        });
      }
    }

    return leads;
  },
};
