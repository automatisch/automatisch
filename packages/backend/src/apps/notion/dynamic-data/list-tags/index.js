export default {
  name: 'List tags',
  key: 'listTags',

  async run($) {
    const tags = {
      data: [],
      error: null,
    };
    const databaseId = $.step.parameters.databaseId;
    let allTags;

    if (!databaseId) {
      return tags;
    }

    const response = await $.http.get(`/v1/databases/${databaseId}`);
    const tagsExist =
      response.data.properties.Tags.multi_select.options.length !== 0;

    if (tagsExist) {
      allTags = response.data.properties.Tags.multi_select.options.map(
        (tag) => tag.name
      );
    } else {
      return tags;
    }

    for (const tag of allTags) {
      tags.data.push({
        value: tag,
        name: tag,
      });
    }

    return tags;
  },
};
