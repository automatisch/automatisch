export default {
  name: 'List collections',
  key: 'listCollections',

  async run($) {
    const { organisationId } = $.step.parameters;

    const params = {
      status: 'live',
    };

    const response = await $.http.get(
      `organizations/${organisationId}/collections`,
      { params }
    );

    response.data = response.data['collections'].map((collection) => {
      return {
        value: collection.id,
        name: collection.name,
      };
    });

    return response;
  },
};
