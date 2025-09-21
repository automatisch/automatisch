import defineDynamicData from '../../../../helpers/define-dynamic-data.js';

export default defineDynamicData({
  name: 'List collections',
  key: 'listCollections',
  async run($) {
    const response = await $.http.get('/rest/v1/collections');
    
    const collections = response.data.items || [];
    
    return collections.map(collection => ({
      label: collection.title,
      value: collection._id.toString(),
    }));
  },
});
