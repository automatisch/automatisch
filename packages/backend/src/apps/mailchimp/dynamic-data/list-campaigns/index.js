export default {
  name: 'List campaigns',
  key: 'listCampaigns',

  async run($) {
    const campaigns = {
      data: [],
    };
    let hasMore = false;
    const audienceId = $.step.parameters.audienceId;

    const params = {
      list_id: audienceId,
      sort_field: 'create_time',
      sort_dir: 'DESC',
      count: 1000,
      offset: 0,
    };

    do {
      const { data } = await $.http.get('/3.0/campaigns', { params });
      params.offset = params.offset + params.count;

      if (data?.campaigns) {
        for (const campaign of data.campaigns) {
          campaigns.data.push({
            value: campaign.id,
            name: campaign.settings.title || campaign.settings.subject_line || 'Unnamed campaign',
          });
        }
      }

      if (data.total_items > params.offset) {
        hasMore = true;
      } else {
        hasMore = false;
      }
    } while (hasMore);

    return campaigns;
  },
};
