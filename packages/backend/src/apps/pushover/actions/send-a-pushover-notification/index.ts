import { IJSONArray, IJSONObject } from '@automatisch/types';
import defineAction from '../../../../helpers/define-action';

export default defineAction({
  name: 'Send a Pushover Notification',
  key: 'sendPushoverNotification',
  description:
    'Generates a Pushover notification on the devices you have subscribed to.',
  arguments: [
    {
      label: 'Title',
      key: 'title',
      type: 'string' as const,
      required: false,
      description: 'An optional title displayed with the message.',
      variables: true,
    },
    {
      label: 'Message',
      key: 'message',
      type: 'string' as const,
      required: true,
      description: 'The main message text of your notification.',
      variables: true,
    },
    {
      label: 'Priority',
      key: 'priority',
      type: 'dropdown' as const,
      required: false,
      description: '',
      variables: true,
      options: [
        { label: 'Lowest (no notification, just in-app message)', value: -2 },
        { label: 'Low (no sound or vibration)', value: -1 },
        { label: 'Normal', value: 0 },
        { label: 'High (bypass quiet hours, highlight)', value: 1 },
        {
          label: 'Emergency (repeat every 30 seconds until acknowledged)',
          value: 2,
        },
      ],
    },
    {
      label: 'Sound',
      key: 'sound',
      type: 'dropdown' as const,
      required: false,
      description: 'Optional sound to override your default.',
      variables: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listSounds',
          },
        ],
      },
    },
    {
      label: 'URL',
      key: 'url',
      type: 'string' as const,
      required: false,
      description: 'URL to display with message.',
      variables: true,
    },
    {
      label: 'URL Title',
      key: 'urlTitle',
      type: 'string' as const,
      required: false,
      description:
        'Title of URL to display, otherwise URL itself will be displayed.',
      variables: true,
    },
    {
      label: 'Devices',
      key: 'devices',
      type: 'dynamic' as const,
      required: false,
      description: '',
      fields: [
        {
          label: 'Device',
          key: 'device',
          type: 'dropdown' as const,
          required: false,
          description:
            'Restrict sending to just these devices on your account.',
          variables: true,
          source: {
            type: 'query',
            name: 'getDynamicData',
            arguments: [
              {
                name: 'key',
                value: 'listDevices',
              },
            ],
          },
        },
      ],
    },
  ],

  async run($) {
    const { title, message, priority, sound, url, urlTitle } =
      $.step.parameters;

    const devices = $.step.parameters.devices as IJSONArray;
    const allDevices = devices
      .map((device: IJSONObject) => device.device)
      .join(',');

    const payload = {
      token: $.auth.data.apiToken,
      user: $.auth.data.userKey,
      title,
      message,
      priority,
      sound,
      url,
      url_title: urlTitle,
      device: allDevices,
    };

    const { data } = await $.http.post('/1/messages.json', payload);

    $.setActionItem({
      raw: data,
    });
  },
});
