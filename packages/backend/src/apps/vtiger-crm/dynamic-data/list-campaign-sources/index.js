export default {
  name: 'List campaign sources',
  key: 'listCampaignSources',

  async run($) {
    const campaignSources = {
      data: [],
    };

    const params = {
      operation: 'query',
      sessionName: $.auth.data.sessionName,
      query: 'SELECT * FROM Campaigns ORDER BY createdtime DESC;',
    };

    const { data } = await $.http.get(`/webservice.php`, { params });

    if (data.result?.length) {
      for (const campaignSource of data.result) {
        campaignSources.data.push({
          value: campaignSource.id,
          name: campaignSource.campaignname,
        });
      }
    }

    return campaignSources;
  },
};
