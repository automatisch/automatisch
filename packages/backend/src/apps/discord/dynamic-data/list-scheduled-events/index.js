export default {
  name: 'List scheduled events',
  key: 'listScheduledEvents',

  async run($) {
    const scheduledEvents = {
      data: [],
      error: null,
    };

    const response = await $.http.get(
      `/guilds/${$.auth.data.guildId}/scheduled-events`
    );

    scheduledEvents.data = response.data.map((scheduledEvent) => {
      return {
        value: scheduledEvent.id,
        name: scheduledEvent.name,
      };
    });

    return scheduledEvents;
  },
};
