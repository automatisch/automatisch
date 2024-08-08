import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Send message',
  key: 'sendMessage',
  description: 'Sends a message to a topic you specify.',
  arguments: [
    {
      label: 'Topic',
      key: 'topic',
      type: 'string',
      required: true,
      description: 'Target topic name.',
      variables: true,
    },
    {
      label: 'Message body',
      key: 'message',
      type: 'string',
      required: true,
      description:
        'Message body to be sent, set to triggered if empty or not passed.',
      variables: true,
    },
    {
      label: 'Title',
      key: 'title',
      type: 'string',
      required: false,
      description: 'Message title.',
      variables: true,
    },
    {
      label: 'Email',
      key: 'email',
      type: 'string',
      required: false,
      description: 'E-mail address for e-mail notifications.',
      variables: true,
    },
    {
      label: 'Click URL',
      key: 'click',
      type: 'string',
      required: false,
      description: 'Website opened when notification is clicked.',
      variables: true,
    },
    {
      label: 'Attach file by URL',
      key: 'attach',
      type: 'string',
      required: false,
      description: 'URL of an attachment.',
      variables: true,
    },
    {
      label: 'Filename',
      key: 'filename',
      type: 'string',
      required: false,
      description: 'File name of the attachment.',
      variables: true,
    },
    {
      label: 'Delay',
      key: 'delay',
      type: 'string',
      required: false,
      description:
        'Timestamp or duration for delayed delivery. For example, 30min or 9am.',
      variables: true,
    },
    {
      label: 'Priority',
      key: 'priority',
      type: 'dropdown',
      required: false,
      description: '',
      value: 3,
      variables: true,
      options: [
        { label: 'Max Priority', value: 5 },
        { label: 'High Priority', value: 4 },
        { label: 'Default Priority', value: 3 },
        { label: 'Low Priority', value: 2 },
        { label: 'Min Priority', value: 1 },
      ],
    },
    {
      label: 'Tags',
      key: 'tags',
      type: 'dynamic',
      required: false,
      description: '',
      fields: [
        {
          label: 'Tag',
          key: 'tag',
          type: 'dropdown',
          required: false,
          description: '',
          variables: true,
          options: [
            { label: '👍', value: '+1' },
            { label: '🥳', value: 'partying_face' },
            { label: '🎉', value: 'tada' },
            { label: '✔', value: 'heavy_check_mark' },
            { label: '📢', value: 'loudspeaker' },
            { label: '👎', value: '-1' },
            { label: '⚠', value: 'warning' },
            { label: '🚨', value: 'rotating_light' },
            { label: '🚩', value: 'triangular_flag_on_post' },
            { label: '💀', value: 'skull' },
            { label: '🤦‍♂️', value: 'facepalm' },
            { label: '⛔️', value: 'no_entry' },
            { label: '🚫', value: 'no_entry_sign' },
            { label: '💿', value: 'cd' },
            { label: '💻', value: 'computer' },
          ],
        },
      ],
    },
  ],

  async run($) {
    const {
      topic,
      message,
      title,
      email,
      click,
      attach,
      filename,
      delay,
      priority,
      tags,
    } = $.step.parameters;

    const allTags = tags
      .map((tag) => tag.tag)
      .filter(Boolean)
      .join(',');

    const payload = {
      topic,
      message,
      title,
      email,
      click,
      attach,
      filename,
      delay,
    };

    const response = await $.http.post('/', payload, {
      headers: {
        'X-Priority': priority,
        'X-Tags': allTags,
      },
    });

    $.setActionItem({
      raw: response.data,
    });
  },
});
