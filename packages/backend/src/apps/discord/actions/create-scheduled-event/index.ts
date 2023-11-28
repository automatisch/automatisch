import defineAction from '../../../../helpers/define-action';

export default defineAction({
  name: 'Create a scheduled event',
  key: 'createScheduledEvent',
  description: 'Creates a scheduled event',
  arguments: [
    {
      label: 'Type',
      key: 'entityType',
      type: 'dropdown' as const,
      required: true,
      variables: true,
      options: [
        { label: 'Stage channel', value: 1 },
        { label: 'Voice channel', value: 2 },
        { label: 'External', value: 3 }
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
      type: 'string' as const,
      required: true,
      variables: true,
    },
    {
      label: 'Description',
      key: 'description',
      type: 'string' as const,
      required: false,
      variables: true,
    },
    {
      label: 'Image',
      key: 'image',
      type: 'string' as const,
      required: false,
      description: 'Image as DataURI scheme [data:image/<jpeg/png/gif>;base64,BASE64_ENCODED_<JPEG/PNG/GIF>_IMAGE_DATA]',
      variables: true,
    },
  ],

  async run($) {
    type entity_metadata = {
      location: string
    }

    type guild_event = {
      channel_id: number,
      name: string,
      privacy_level: number,
      scheduled_start_time: string,
      scheduled_end_time?: string,
      description?: string,
      entity_type?: number,
      entity_metadata?: entity_metadata,
      image?: string, //data:image/jpeg;base64,BASE64_ENCODED_JPEG_IMAGE_DATA
    }


    const data: guild_event = {
      channel_id: $.step.parameters.channel_id as number,
      name: $.step.parameters.name as string,
      privacy_level: 2,
      scheduled_start_time: $.step.parameters.scheduledStartTime as string,
      scheduled_end_time: $.step.parameters.scheduledEndTime as string,
      description: $.step.parameters.description as string,
      entity_type: $.step.parameters.entityType as number,
      image: $.step.parameters.image as string,
    };

    const isExternal = $.step.parameters.entityType === 3;
    if (isExternal) {
      data.entity_metadata = {
        location: $.step.parameters.location as string,
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
