export default {
  name: 'List services',
  key: 'listServices',

  async run($) {
    const services = {
      data: [],
    };

    const params = {
      operation: 'query',
      sessionName: $.auth.data.sessionName,
      query: 'SELECT * FROM Services ORDER BY createdtime DESC;',
    };

    const { data } = await $.http.get('/webservice.php', { params });

    if (data.result?.length) {
      for (const service of data.result) {
        services.data.push({
          value: service.id,
          name: service.servicename,
        });
      }
    }

    return services;
  },
};
