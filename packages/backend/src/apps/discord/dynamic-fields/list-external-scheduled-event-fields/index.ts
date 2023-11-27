import { IGlobalVariable } from '@automatisch/types';
export default {
  name: 'List external scheduled event fields',
  key: 'listExternalScheduledEventFields',

  async run($: IGlobalVariable) {
    const isExternal = $.step.parameters.entityType === 3;

    if (isExternal) {
      return [
        {
          label: 'Location',
          key: 'location',
          type: 'string' as const,
          required: true,
          description: 'The location of the event (1-100 characters). This will be omitted if type is NOT EXTERNAL',
          variables: true,
        },
        {
          label: 'Start-Time',
          key: 'scheduledStartTime',
          type: 'string' as const,
          required: true,
          description: 'The time the event will start [ISO8601]',
          variables: true,
        },
        {
          label: 'End-Time',
          key: 'scheduledEndTime',
          type: 'string' as const,
          required: true,
          description: 'The time the event will end [ISO8601]. This will be omitted if type is NOT EXTERNAL',
          variables: true,
        },
      ];
    }

    return [
      {
        label: 'Channel',
        key: 'channel_id',
        type: 'dropdown' as const,
        required: true,
        description: 'Pick a voice or stage channel to link the event to. This will be omitted if type is EXTERNAL',
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
        description: 'The location of the event (1-100 characters). This will be omitted if type is NOT EXTERNAL',
        variables: true,
      },
      {
        label: 'Start-Time',
        key: 'scheduledStartTime',
        type: 'string' as const,
        required: true,
        description: 'The time the event will start [ISO8601]',
        variables: true,
      },
      {
        label: 'End-Time',
        key: 'scheduledEndTime',
        type: 'string' as const,
        required: false,
        description: 'The time the event will end [ISO8601]. This will be omitted if type is NOT EXTERNAL',
        variables: true,
      },
    ];
  },
};
