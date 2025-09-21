import defineTrigger from '../../../../helpers/define-trigger.js';

export default defineTrigger({
  name: 'New bookmark',
  key: 'newBookmark',
  description: 'Triggered when a new bookmark is added to a collection',
  pollInterval: 60, // Check every minute
  arguments: [
    {
      label: 'Collection',
      key: 'collectionId',
      type: 'dropdown',
      required: true,
      description: 'Select the collection to monitor for new bookmarks',
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
  ],
  async run($) {
    const { collectionId } = $.step.parameters;
    
    // Get the last bookmark ID we processed (stored in datastore)
    const lastBookmarkId = await $.app.datastore.get('lastBookmarkId') || 0;
    
    // Fetch recent bookmarks from the collection
    const response = await $.http.get(`/rest/v1/raindrops/${collectionId}`, {
      params: {
        perpage: 50,
        sort: 'created',
      },
      headers: {
        Authorization: `Bearer ${$.auth.data.accessToken}`,
      },
    });
    
    const bookmarks = response.data.items || [];
    
    // Filter for new bookmarks (created after our last processed bookmark)
    const newBookmarks = bookmarks.filter(bookmark => 
      bookmark._id > lastBookmarkId
    );
    
    // Update the last processed bookmark ID
    if (newBookmarks.length > 0) {
      const latestId = Math.max(...newBookmarks.map(b => b._id));
      await $.app.datastore.set('lastBookmarkId', latestId);
    }
    
    // Return the new bookmarks as trigger data
    return newBookmarks.map(bookmark => ({
      raw: bookmark,
      meta: {
        internalId: bookmark._id.toString(),
      },
    }));
  },
});
