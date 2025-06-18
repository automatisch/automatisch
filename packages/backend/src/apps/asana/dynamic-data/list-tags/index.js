export default {
  name: 'List tags',
  key: 'listTags',

  async run($) {
    const tags = {
      data: [],
    };
    const workspaceId = $.step.parameters.workspaceId;

    if (!workspaceId) {
      return workspaceId;
    }

    const params = {
      limit: 100,
      offset: undefined,
      workspace: workspaceId,
    };

    do {
      const {
        data: { data, next_page },
      } = await $.http.get('/1.0/tags', {
        params,
      });

      params.offset = next_page?.offset;

      if (data) {
        for (const tag of data) {
          tags.data.push({
            value: tag.gid,
            name: tag.name,
          });
        }
      }
    } while (params.offset);

    return tags;
  },
};
