import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Create board',
  key: 'createBoard',
  description: 'Creates a new board.',
  arguments: [
    {
      label: 'Board Name',
      key: 'boardName',
      type: 'string',
      required: true,
      description: 'Title for the board.',
      variables: true,
    },
    {
      label: 'Board Kind',
      key: 'boardKind',
      type: 'dropdown',
      required: true,
      description: '',
      variables: true,
      options: [
        {
          label: 'Main',
          value: 'public',
        },
        {
          label: 'Private',
          value: 'private',
        },
        {
          label: 'Shareable',
          value: 'share',
        },
      ],
    },
    {
      label: 'Template ID',
      key: 'templateId',
      type: 'string',
      required: false,
      description:
        "When you switch on developer mode, you'll spot the template IDs in your template store. Additionally, you have the option to utilize the Board ID from any board you've saved as a template.",
      variables: true,
    },
  ],

  async run($) {
    const { boardName, boardKind, templateId } = $.step.parameters;

    const body = {
      query: `mutation {
        create_board (board_name: "${boardName}", board_kind: ${boardKind}${
        templateId ? `, template_id: ${templateId}` : ''
      }) {
          id
          name
          board_kind
        }
      }`,
    };

    const { data } = await $.http.post('/', body);

    $.setActionItem({
      raw: data,
    });
  },
});
