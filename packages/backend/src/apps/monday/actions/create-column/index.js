import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Create column',
  key: 'createColumn',
  description: 'Creates a new column in a board.',
  arguments: [
    {
      label: 'Board',
      key: 'boardId',
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
            value: 'listBoards',
          },
        ],
      },
    },
    {
      label: 'Column Title',
      key: 'columnTitle',
      type: 'string',
      required: true,
      description: '',
      variables: true,
    },
    {
      label: 'Column Type',
      key: 'columnType',
      type: 'dropdown',
      required: true,
      description: '',
      variables: true,
      options: [
        { label: 'Button', value: 'button' },
        { label: 'Checkbox', value: 'checkbox' },
        { label: 'Color Picker', value: 'color_picker' },
        { label: 'Connect Boards', value: 'board_relation' },
        { label: 'Country', value: 'country' },
        { label: 'Creation Log', value: 'creation_log' },
        { label: 'Date', value: 'date' },
        { label: 'Dependency', value: 'dependency' },
        { label: 'Dropdown', value: 'dropdown' },
        { label: 'Email', value: 'email' },
        { label: 'Files', value: 'file' },
        { label: 'Formula', value: 'formula' },
        { label: 'Hour', value: 'hour' },
        { label: 'Item ID', value: 'item_id' },
        { label: 'Last Updated', value: 'last_updated' },
        { label: 'Link', value: 'link' },
        { label: 'Location', value: 'location' },
        { label: 'Long Text', value: 'long_text' },
        { label: 'Mirror', value: 'mirror' },
        { label: 'monday Doc', value: 'doc' },
        { label: 'Name', value: 'name' },
        { label: 'Numbers', value: 'numbers' },
        { label: 'People', value: 'people' },
        { label: 'Phone', value: 'phone' },
        { label: 'Rating', value: 'rating' },
        { label: 'Status', value: 'status' },
        { label: 'Tags', value: 'tags' },
        { label: 'Text', value: 'text' },
        { label: 'Timeline', value: 'timeline' },
        { label: 'Time Tracking', value: 'time_tracking' },
        { label: 'Vote', value: 'vote' },
        { label: 'Week', value: 'week' },
        { label: 'World Clock', value: 'world_clock' },
      ],
    },
  ],

  async run($) {
    const { boardId, columnTitle, columnType } = $.step.parameters;

    const body = {
      query: `
      mutation{
        create_column (board_id: ${boardId}, title: "${columnTitle}", column_type: ${columnType}) {
          id
          title
        }
      }`,
    };

    const { data } = await $.http.post('/', body);

    $.setActionItem({
      raw: data,
    });
  },
});
