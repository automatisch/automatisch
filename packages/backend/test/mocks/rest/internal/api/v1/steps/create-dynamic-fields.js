const createDynamicFieldsMock = async () => {
  const data = [
    {
      label: 'Bot name',
      key: 'botName',
      type: 'string',
      required: true,
      value: 'Automatisch',
      description:
        'Specify the bot name which appears as a bold username above the message inside Slack. Defaults to Automatisch.',
      variables: true,
    },
    {
      label: 'Bot icon',
      key: 'botIcon',
      type: 'string',
      required: false,
      description:
        'Either an image url or an emoji available to your team (surrounded by :). For example, https://example.com/icon_256.png or :robot_face:',
      variables: true,
    },
  ];

  return {
    data: data,
    meta: {
      count: data.length,
      currentPage: null,
      isArray: true,
      totalPages: null,
      type: 'Object',
    },
  };
};

export default createDynamicFieldsMock;
