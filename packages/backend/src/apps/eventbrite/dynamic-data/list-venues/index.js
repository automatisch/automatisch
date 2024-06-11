export default {
  name: 'List venues',
  key: 'listVenues',

  async run($) {
    const venues = {
      data: [],
    };
    const organizationId = $.step.parameters.organizationId;

    if (!organizationId) {
      return venues;
    }

    const params = {
      continuation: undefined,
    };

    do {
      const { data } = await $.http.get(
        `/v3/organizations/${organizationId}/venues/`,
        {
          params,
        }
      );

      if (data.pagination.has_more_items) {
        params.continuation = data.pagination.continuation;
      }

      if (data.venues) {
        for (const venue of data.venues) {
          venues.data.push({
            value: venue.id,
            name: venue.name,
          });
        }
      }
    } while (params.continuation);

    return venues;
  },
};
