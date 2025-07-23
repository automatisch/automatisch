export default {
  name: 'List events',
  key: 'listEvents',

  async run($) {
    const events = {
      data: [],
    };
    const organizationId = $.step.parameters.organizationId;
    const unpublished = $.step.parameters.unpublished === 'true';

    if (!organizationId) {
      return events;
    }

    const params = {
      continuation: undefined,
      order_by: 'created_desc',
    };

    if (unpublished) {
      params.status = 'draft';
    }

    do {
      const { data } = await $.http.get(
        `/v3/organizations/${organizationId}/events/`,
        {
          params,
        }
      );

      if (data.pagination.has_more_items) {
        params.continuation = data.pagination.continuation;
      }

      if (data.events) {
        for (const event of data.events) {
          events.data.push({
            value: event.id,
            name: `${event.name.text} (${event.status})`,
          });
        }
      }
    } while (params.continuation);

    return events;
  },
};
