export default {
  name: 'List engagements',
  key: 'listEngagements',

  async run($) {
    const workspaceId = $.step.parameters.workspaceId;

    if (!workspaceId) {
      return {
        data: [],
      };
    }

    const result = {
      data: [],
    };

    let pageToken;

    do {
      const { data } = await $.http.post(
        '/wauld.EngagementService/ListEngagements',
        {
          parent: workspaceId,
          pageSize: 10,
          ...(pageToken ? { pageToken } : {}),
        }
      );

      for (const engagement of data.engagements || []) {
        result.data.push({
          value: engagement.id,
          name: engagement.name,
        });
      }

      pageToken = data.nextPageToken;
    } while (pageToken);

    return result;
  },
};