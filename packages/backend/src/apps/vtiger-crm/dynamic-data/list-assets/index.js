export default {
  name: 'List assets',
  key: 'listAssets',

  async run($) {
    const assets = {
      data: [],
    };

    const params = {
      operation: 'query',
      sessionName: $.auth.data.sessionName,
      query: 'SELECT * FROM Assets ORDER BY createdtime DESC;',
    };

    const { data } = await $.http.get('/webservice.php', { params });

    if (data.result?.length) {
      for (const asset of data.result) {
        assets.data.push({
          value: asset.id,
          name: `${asset.assetname} (${asset.assetstatus})`,
        });
      }
    }

    return assets;
  },
};
