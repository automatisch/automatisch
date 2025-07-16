export default {
  name: 'List workspaces',
  key: 'listWorkspaces',

  async run($) {
    const workspaces = {
      data: [],
    };

    const params = {
      'page[size]': 100,
      'page[number]': 1,
    };
    let next = false;

    do {
      const { data } = await $.http.get('/v1/workspace_cards');
      next = data.meta.next_page;
      params['page[number]'] = data.meta.next_page;

      if (!data?.workspace_cards?.length) {
        return;
      }

      for (const workspace of data.workspace_cards) {
        workspaces.data.push({
          value: workspace.id,
          name: workspace.identifier,
        });
      }
    } while (next);

    return workspaces;
  },
};
