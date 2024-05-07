export default {
  name: 'List service contracts',
  key: 'listServiceContracts',

  async run($) {
    const serviceContracts = {
      data: [],
    };

    const params = {
      operation: 'query',
      sessionName: $.auth.data.sessionName,
      query: 'SELECT * FROM ServiceContracts ORDER BY createdtime DESC;',
    };

    const { data } = await $.http.get('/webservice.php', { params });

    if (data.result?.length) {
      for (const serviceContract of data.result) {
        serviceContracts.data.push({
          value: serviceContract.id,
          name: serviceContract.subject,
        });
      }
    }

    return serviceContracts;
  },
};
