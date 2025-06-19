export default {
  name: 'List labels',
  key: 'listLabels',

  async run($) {
    const labels = {
      data: [],
    };
    const userId = $.auth.data.userId;

    const { data } = await $.http.get(`/gmail/v1/users/${userId}/labels`);

    for (const label of data.labels) {
      labels.data.push({
        value: label.id,
        name: label.name,
      });
    }

    return labels;
  },
};
