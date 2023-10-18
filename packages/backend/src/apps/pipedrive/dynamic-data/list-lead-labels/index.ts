import { IGlobalVariable, IJSONObject } from '@automatisch/types';

export default {
  name: 'List lead labels',
  key: 'listLeadLabels',

  async run($: IGlobalVariable) {
    const leadLabels: {
      data: IJSONObject[];
    } = {
      data: [],
    };

    const { data } = await $.http.get(
      `${$.auth.data.apiDomain}/api/v1/leadLabels`
    );

    if (data.data?.length) {
      for (const leadLabel of data.data) {
        const name = `${leadLabel.name} (${leadLabel.color})`;
        leadLabels.data.push({
          value: leadLabel.id,
          name,
        });
      }
    }

    return leadLabels;
  },
};
