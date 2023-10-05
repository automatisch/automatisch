import defineAction from '../../../../helpers/define-action';

type Body = {
  data: {
    title: string;
    description?: string;
    dueDate?: string;
  };
  style?: {
    cardTheme?: string;
  };
  parent: {
    id: string;
  };
};

export default defineAction({
  name: 'Create card widget',
  key: 'createCardWidget',
  description: 'Creates a new card widget on an existing board.',
  arguments: [
    {
      label: 'Board',
      key: 'boardId',
      type: 'dropdown' as const,
      required: true,
      description: '',
      variables: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listBoards',
          },
        ],
      },
    },
    {
      label: 'Frame',
      key: 'frameId',
      type: 'dropdown' as const,
      required: true,
      dependsOn: ['parameters.boardId'],
      description:
        'You need to create a frame prior to this step. Switch frame to grid mode to avoid cards overlap.',
      variables: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listFrames',
          },
          {
            name: 'parameters.boardId',
            value: '{parameters.boardId}',
          },
        ],
      },
    },
    {
      label: 'Card Title',
      key: 'cardTitle',
      type: 'string' as const,
      required: true,
      description: '',
      variables: true,
    },
    {
      label: 'Card Title Link',
      key: 'cardTitleLink',
      type: 'string' as const,
      required: false,
      description: '',
      variables: true,
    },
    {
      label: 'Card Description',
      key: 'cardDescription',
      type: 'string' as const,
      required: false,
      description: '',
      variables: true,
    },
    {
      label: 'Card Due Date',
      key: 'cardDueDate',
      type: 'string' as const,
      required: false,
      description:
        'format: date-time. Example value: 2023-10-12 22:00:55+00:00',
      variables: true,
    },
    {
      label: 'Card Border Color',
      key: 'cardBorderColor',
      type: 'dropdown' as const,
      required: false,
      description: 'In hex format. Default is blue (#2399F3).',
      variables: true,
      options: [
        { label: 'white', value: '#FFFFFF' },
        { label: 'yellow', value: '#FEF445' },
        { label: 'orange', value: '#FAC710' },
        { label: 'red', value: '#F24726' },
        { label: 'bright red', value: '#DA0063' },
        { label: 'light gray', value: '#E6E6E6' },
        { label: 'gray', value: '#808080' },
        { label: 'black', value: '#1A1A1A' },
        { label: 'light green', value: '#CEE741' },
        { label: 'green', value: '#8FD14F' },
        { label: 'dark green', value: '#0CA789' },
        { label: 'light blue', value: '#12CDD4' },
        { label: 'blue', value: '#2D9BF0' },
        { label: 'dark blue', value: '#414BB2' },
        { label: 'purple', value: '#9510AC' },
        { label: 'dark purple', value: '#652CB3' },
      ],
    },
  ],

  async run($) {
    const {
      boardId,
      frameId,
      cardTitle,
      cardTitleLink,
      cardDescription,
      cardDueDate,
      cardBorderColor,
    } = $.step.parameters;

    let title;
    if (cardTitleLink) {
      title = `<a href='${cardTitleLink}'>${cardTitle}</a>`;
    } else {
      title = cardTitle;
    }

    const body: Body = {
      data: {
        title: title as string,
        description: cardDescription as string,
      },
      style: {},
      parent: {
        id: frameId as string,
      },
    };

    if (cardBorderColor) {
      body.style.cardTheme = cardBorderColor as string;
    }

    if (cardDueDate) {
      body.data.dueDate = cardDueDate as string;
    }

    const response = await $.http.post(`/v2/boards/${boardId}/cards`, body);

    $.setActionItem({
      raw: response.data,
    });
  },
});
