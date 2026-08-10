export default {
  name: 'List documents',
  key: 'listDocuments',

  async run($) {
    const engagementId = $.step.parameters.engagementId;

    if (!engagementId) {
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
        '/wauld.DocumentService/ListDocuments',
        {
          parent: engagementId,
          pageSize: 10,
          ...(pageToken ? { pageToken } : {}),
        }
      );

      for (const document of data.documents || []) {
        result.data.push({
          value: document.id,
          name: document.name,
        });
      }

      pageToken = data.nextPageToken;
    } while (pageToken);

    return result;
  },
};