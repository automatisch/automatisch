import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Create bookmark',
  key: 'createBookmark',
  description: 'Create a new bookmark in a Raindrop.io collection',
  arguments: [
    {
      label: 'Collection',
      key: 'collectionId',
      type: 'dropdown',
      required: true,
      description: 'Select the collection to add the bookmark to',
      variables: false,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listCollections',
          },
        ],
      },
    },
    {
      label: 'URL',
      key: 'url',
      type: 'string',
      required: true,
      description: 'The URL to bookmark',
      variables: true,
    },
    {
      label: 'Title',
      key: 'title',
      type: 'string',
      required: false,
      description: 'Title for the bookmark (optional)',
      variables: true,
    },
    {
      label: 'Description',
      key: 'description',
      type: 'text',
      required: false,
      description: 'Description for the bookmark (optional)',
      variables: true,
    },
    {
      label: 'Tags',
      key: 'tags',
      type: 'string',
      required: false,
      description: 'Comma-separated tags for the bookmark (optional)',
      variables: true,
    },
  ],
  async run($) {
    const { collectionId, url, title, description, tags } = $.step.parameters;
    
    const bookmarkData = {
      link: url,
      collection: {
        $id: parseInt(collectionId),
      },
    };
    
    // Add optional fields if provided
    if (title) {
      bookmarkData.title = title;
    }
    
    if (description) {
      bookmarkData.excerpt = description;
    }
    
    if (tags) {
      bookmarkData.tags = tags.split(',').map(tag => tag.trim());
    }
    
    const response = await $.http.post('/rest/v1/raindrop', bookmarkData, {
      headers: {
        Authorization: `Bearer ${$.auth.data.accessToken}`,
      },
    });
    
    return {
      raw: response.data,
      meta: {
        internalId: response.data._id.toString(),
      },
    };
  },
});
