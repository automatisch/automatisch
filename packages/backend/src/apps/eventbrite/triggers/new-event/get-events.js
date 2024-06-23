const getEvents = async ($) => {
  const params = {
    order_by: 'created_desc',
    status: 'live',
  };

  // get events from eventbrite for the given organisation id
  const response = await $.http.get(
    `organizations/${$.step.parameters.organisationId?.trim()}/events`,
    { params }
  );

  for (const event of response.data['events']) {
    if (event && "venue_id" in event) {
      const venueResponse = await $.http.get(
        `venues/${event["venue_id"]}`
      );
      event.venue = venueResponse.data;
    }

    $.pushTriggerItem({
      raw: event,
      meta: {
        internalId: event.id,
      },
    });
  }
};

export default getEvents;
