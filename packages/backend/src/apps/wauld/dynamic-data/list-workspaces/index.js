export default {
  name: 'List workspaces',
  key: 'listWorkspaces',

  async run($) {
    const result = {
      data: [],
    };

    let pageToken;

    do {
      const { data } = await $.http.post(
        '/wauld.WorkspaceService/ListWorkspaces',
        {
          parent: $.auth.data.accountId,
          pageSize: 25,
          ...(pageToken ? { pageToken } : {}),
        }
      );

      for (const workspace of data.workspaces || []) {
        result.data.push({
          value: workspace.id,
          name: workspace.name,
        });
      }

      pageToken = data.nextPageToken;
    } while (pageToken);

    return result;
  },
};