import defineTrigger from '../../../../helpers/define-trigger.js';

export default defineTrigger({
  name: 'Get user activity',
  key: 'getActivity',
  pollInterval: 15,
  description: 'Triggers when there are new user activities.',

  async run($) {
    let response;

    const headers = {
      'OCS-APIRequest': true,
    };

    do {
      let requestPath = `/ocs/v2.php/apps/activity/api/v2/activity`;
      response = await $.http.get(requestPath, { headers });

      response.data.ocs.data.forEach((activity) => {
        const dataItem = {
          raw: activity,
          meta: {
            internalId: `${activity.activity_id}`,
          },
        };

        $.pushTriggerItem(dataItem);
      });
    } while (response.data.length >= 10);
  },
});
