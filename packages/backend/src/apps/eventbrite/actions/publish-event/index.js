import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Publish event',
  key: 'publishEvent',
  description: 'Publishes a draft event.',
  arguments: [
    {
      label: 'Organization',
      key: 'organizationId',
      type: 'dropdown',
      required: false,
      description: '',
      variables: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listOrganizations',
          },
        ],
      },
    },
    {
      label: 'Event',
      key: 'eventId',
      type: 'dropdown',
      required: true,
      description: '',
      variables: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listEvents',
          },
          {
            name: 'parameters.organizationId',
            value: '{parameters.organizationId}',
          },
          {
            name: 'parameters.unpublished',
            value: 'true',
          },
        ],
      },
    },
  ],

  async run($) {
    const { eventId } = $.step.parameters;

    const { data } = await $.http.post(`/v3/events/${eventId}/publish/`);

    $.setActionItem({
      raw: data,
    });
  },
});
