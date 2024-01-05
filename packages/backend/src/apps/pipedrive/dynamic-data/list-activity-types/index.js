export default {
  name: 'List activity types',
  key: 'listActivityTypes',

  async run($) {
    const activityTypes = {
      data: [],
    };

    const { data } = await $.http.get(
      `${$.auth.data.apiDomain}/api/v1/activityTypes`
    );

    if (data.data?.length) {
      for (const activityType of data.data) {
        activityTypes.data.push({
          value: activityType.key_string,
          name: activityType.name,
        });
      }
    }

    return activityTypes;
  },
};
