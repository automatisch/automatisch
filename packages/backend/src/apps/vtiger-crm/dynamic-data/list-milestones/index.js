export default {
  name: 'List milestones',
  key: 'listMilestones',

  async run($) {
    const milestones = {
      data: [],
    };

    const params = {
      operation: 'query',
      sessionName: $.auth.data.sessionName,
      query: 'SELECT * FROM ProjectMilestone ORDER BY createdtime DESC;',
    };

    const { data } = await $.http.get('/webservice.php', { params });

    if (data.result?.length) {
      for (const milestone of data.result) {
        milestones.data.push({
          value: milestone.id,
          name: milestone.projectmilestonename,
        });
      }
    }

    return milestones;
  },
};
