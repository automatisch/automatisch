export default {
  name: 'List collections',
  key: 'listCollections',

  async run($) {
    const response = await $.http.get('/rest/v1/collections', {
      headers: {
        Authorization: `Bearer ${$.auth.data.accessToken}`,
      },
    });
    
    const collections = response.data.items || [];
    
    return collections.map(collection => ({
      label: collection.title,
      value: collection._id.toString(),
    }));
  },
};
