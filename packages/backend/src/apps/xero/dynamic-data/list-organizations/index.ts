import { IGlobalVariable, IJSONObject } from '@automatisch/types';

export default {
  name: 'List organizations',
  key: 'listOrganizations',

  async run($: IGlobalVariable) {
    const organizations: {
      data: IJSONObject[];
    } = {
      data: [],
    };

    const { data } = await $.http.get('/api.xro/2.0/Organisation');

    if (data.Organisations?.length) {
      for (const organization of data.Organisations) {
        organizations.data.push({
          value: organization.OrganisationID,
          name: organization.Name,
        });
      }
    }

    return organizations;
  },
};
