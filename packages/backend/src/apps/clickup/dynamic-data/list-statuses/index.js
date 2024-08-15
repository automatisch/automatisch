export default {
  name: 'List statuses',
  key: 'listStatuses',

  async run($) {
    const statuses = {
      data: [],
    };
    const listId = $.step.parameters.listId;

    if (!listId) {
      return statuses;
    }

    const { data } = await $.http.get(`/v2/list/${listId}`);

    if (data.statuses) {
      for (const status of data.statuses) {
        statuses.data.push({
          value: status.status,
          name: status.status,
        });
      }
    }

    return statuses;
  },
};
