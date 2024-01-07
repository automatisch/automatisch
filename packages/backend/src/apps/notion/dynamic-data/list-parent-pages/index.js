export default {
  name: 'List parent pages',
  key: 'listParentPages',

  async run($) {
    const parentPages = {
      data: [],
      error: null,
    };
    const payload = {
      filter: {
        value: 'page',
        property: 'object',
      },
    };

    do {
      const response = await $.http.post('/v1/search', payload);

      payload.start_cursor = response.data.next_cursor;

      const topLevelPages = response.data.results.filter(
        (page) => page.parent.workspace
      );

      for (const pages of topLevelPages) {
        parentPages.data.push({
          value: pages.id,
          name: pages.properties.title.title[0].plain_text,
        });
      }
    } while (payload.start_cursor);

    return parentPages;
  },
};
