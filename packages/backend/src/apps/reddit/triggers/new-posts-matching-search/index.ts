import defineTrigger from '../../../../helpers/define-trigger';

export default defineTrigger({
  name: 'New posts matching search',
  key: 'newPostsMatchingSearch',
  pollInterval: 15,
  description: 'Triggers when a search string matches a new post.',
  arguments: [
    {
      label: 'Search Query',
      key: 'searchQuery',
      type: 'string' as const,
      required: true,
      description:
        'The term or expression to look for, restricted to 512 characters. If your query contains periods (e.g., automatisch.io), ensure it is enclosed in quotes ("automatisch.io").',
      variables: true,
    },
  ],

  async run($) {
    const { searchQuery } = $.step.parameters;
    const params = {
      q: searchQuery,
      type: 'link',
      sort: 'new',
      limit: 100,
      after: undefined as unknown as string,
    };

    do {
      const { data } = await $.http.get('/search', {
        params,
      });
      params.after = data.data.after;

      if (data.data.children?.length) {
        for (const item of data.data.children) {
          $.pushTriggerItem({
            raw: item,
            meta: {
              internalId: item.data.id,
            },
          });
        }
      }
    } while (params.after);
  },
});
