export default {
  name: 'List sla names',
  key: 'listSlaNames',

  async run($) {
    const slaNames = {
      data: [],
    };

    const params = {
      operation: 'query',
      sessionName: $.auth.data.sessionName,
      query: 'SELECT * FROM SLA ORDER BY createdtime DESC;',
    };

    const { data } = await $.http.get(`/webservice.php`, { params });

    if (data.result?.length) {
      for (const slaName of data.result) {
        slaNames.data.push({
          value: slaName.id,
          name: slaName.policy_name,
        });
      }
    }

    return slaNames;
  },
};
