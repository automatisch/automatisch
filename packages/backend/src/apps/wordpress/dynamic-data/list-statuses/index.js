export default {
  name: 'List statuses',
  key: 'listStatuses',

  async run($) {
    const statuses = {
      data: [],
    };

    const { data } = await $.http.get('?rest_route=/wp/v2/statuses');

    if (!data) return statuses;

    const values = Object.values(data);

    if (!values?.length) return statuses;

    for (const status of values) {
      statuses.data.push({
        value: status.slug,
        name: status.name,
      });
    }

    return statuses;
  },
};
