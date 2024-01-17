export default {
  name: 'List groups',
  key: 'listGroups',

  async run($) {
    const groups = {
      data: [],
    };

    const params = {
      operation: 'query',
      sessionName: $.auth.data.sessionName,
      query: 'SELECT * FROM Groups;',
    };

    const { data } = await $.http.get('/webservice.php', { params });

    if (data.result?.length) {
      for (const group of data.result) {
        groups.data.push({
          value: group.id,
          name: group.groupname,
        });
      }
    }

    return groups;
  },
};
