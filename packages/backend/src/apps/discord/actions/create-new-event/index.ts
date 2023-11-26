import defineAction from '../../../../helpers/define-action';

export default defineAction({
  name: 'Create a new event',
  key: 'createNewEvent',
  description: 'Creates a new event',
  arguments: [
    {
      label: 'Type',
      key: 'entity_type',
      type: 'dropdown' as const,
      required: true,
      description: 'The name of the event.',
      variables: true,
      options: [
        {label: 'Stage-Channel', value: 1},
        {label: 'Voicechannel', value: 2},
        {label: 'External', value: 3}
      ]
    },
    {
      label: 'Privacy level',
      key: 'privacy_level',
      type: 'dropdown' as const,
      required: true,
      description: 'The privacy level of the event',
      variables: true,
      options: [
        {label: 'Public', value: 1},
        {label: 'Private', value: 2}
      ],
    },
    {
      label: 'Name',
      key: 'name',
      type: 'string' as const,
      required: true,
      description: 'The name of the event.',
      variables: true,
    },
    {
      label: 'Description',
      key: 'description',
      type: 'string' as const,
      required: false,
      description: 'The description of the event.',
      variables: true,
    },
    {
      label: 'Start-Time',
      key: 'scheduled_start_time',
      type: 'string' as const,
      required: true,
      description: 'The time the event will start [ISO8601]',
      variables: true,
    },
    {
      label: 'End-Time',
      key: 'scheduled_end_time',
      type: 'string' as const,
      required: false,
      description: 'The time the event will end [ISO8601]. This will be cleared if type is NOT EXTERNAL',
      variables: true,
    },
    {
      label: 'Channel',
      key: 'channel_id',
      type: 'dropdown' as const,
      required: false,
      description: 'Pick a voice or stage channel to link the event to. This will be cleared if type is EXTERNAL',
      variables: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listVoiceChannels',
          },
        ],
      },
    },
    {
      label: 'Location',
      key: 'location',
      type: 'string' as const,
      required: false,
      description: 'The location of the event (1-100 characters). This will be cleared if type is NOT EXTERNAL',
      variables:  true,
    },
    {
      label: 'Image',
      key: 'image',
      type: 'string' as const,
      required: false,
      description: 'Image as DataURI scheme [data:image/<jpeg/png/gif>;base64,BASE64_ENCODED_<JPEG/PNG/GIF>_IMAGE_DATA]',
      variables:  true,
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


    const data : guild_event = {
      channel_id: $.step.parameters.channel_id as number,
      name: $.step.parameters.name as string,
      privacy_level: $.step.parameters.privacy_level as number,
      scheduled_start_time: $.step.parameters.scheduled_start_time as string,
      scheduled_end_time: $.step.parameters.scheduled_end_time as string,
      description: $.step.parameters.description as string,
      entity_type: $.step.parameters.entity_type as number,
      image: $.step.parameters.image as string,
    };

    // modifications depending on whether event type is set to EXTERNAL or not
    if($.step.parameters.entity_type === 3) {
      // entity_metadata must not be added unless type is EXTERNAL
      const entity_metadata = {
        location: $.step.parameters.location as string,
      }
      // add metadata, clear channel if EXTERNAL
      data.entity_metadata = entity_metadata;
      data.channel_id = null;
    } else {
      // clear end_time if it's not EXTERNAL
      data.scheduled_end_time = null;
    }

    const response = await $.http?.post(
      `/guilds/${$.auth.data.guildId}/scheduled-events`,
      data
    );

    $.setActionItem({ raw: response.data });
  },
});
