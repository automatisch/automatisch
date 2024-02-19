export default {
  name: 'List tags',
  key: 'listTags',

  async run($) {
    const tags = {
      data: [],
    };
    const spaceId = $.step.parameters.spaceId;

    if (!spaceId) {
      return spaceId;
    }

    const { data } = await $.http.get(`v2/space/${spaceId}/tag`);

    if (data.tags) {
      for (const tag of data.tags) {
        tags.data.push({
          value: tag.name,
          name: tag.name,
        });
      }
    }

    return tags;
  },
};
