import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Create a scheduled event',
  key: 'createScheduledEvent',
  description: 'Creates a scheduled event',
  arguments: [
    {
      label: 'Type',
      key: 'entityType',
      type: 'dropdown',
      required: true,
      variables: true,
      options: [
        { label: 'Stage channel', value: 1 },
        { label: 'Voice channel', value: 2 },
        { label: 'External', value: 3 },
      ],
      additionalFields: {
        type: 'query',
        name: 'getDynamicFields',
        arguments: [
          {
            name: 'key',
            value: 'listExternalScheduledEventFields',
          },
          {
            name: 'parameters.entityType',
            value: '{parameters.entityType}',
          },
        ],
      },
    },
    {
      label: 'Name',
      key: 'name',
      type: 'string',
      required: true,
      variables: true,
    },
    {
      label: 'Description',
      key: 'description',
      type: 'string',
      required: false,
      variables: true,
    },
    {
      label: 'Image',
      key: 'image',
      type: 'string',
      required: false,
      description:
        'Image as DataURI scheme [data:image/<jpeg/png/gif>;base64,BASE64_ENCODED_<JPEG/PNG/GIF>_IMAGE_DATA]',
      variables: true,
    },
  ],

  async run($) {
    const data = {
      channel_id: $.step.parameters.channel_id,
      name: $.step.parameters.name,
      privacy_level: 2,
      scheduled_start_time: $.step.parameters.scheduledStartTime,
      scheduled_end_time: $.step.parameters.scheduledEndTime,
      description: $.step.parameters.description,
      entity_type: $.step.parameters.entityType,
      image: $.step.parameters.image,
    };

    const isExternal = $.step.parameters.entityType === 3;

    if (isExternal) {
      data.entity_metadata = {
        location: $.step.parameters.location,
      };

      data.channel_id = null;
    }

    const response = await $.http?.post(
      `/guilds/${$.auth.data.guildId}/scheduled-events`,
      data
    );

    $.setActionItem({ raw: response.data });
  },
});
