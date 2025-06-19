import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Create item',
  key: 'createItem',
  description: 'Creates a new item in a board.',
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
      label: 'Group',
      key: 'groupId',
      type: 'dropdown',
      required: false,
      description: '',
      dependsOn: ['parameters.boardId'],
      variables: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listGroups',
          },
          {
            name: 'parameters.boardId',
            value: '{parameters.boardId}',
          },
        ],
      },
    },
    {
      label: 'Item Name',
      key: 'itemName',
      type: 'string',
      required: true,
      description: '',
      variables: true,
    },
    {
      label: 'Subitem Names',
      key: 'subitemNames',
      type: 'dynamic',
      required: false,
      description: '',
      fields: [
        {
          label: 'Subitem Name',
          key: 'subitemName',
          type: 'string',
          required: false,
          description: '',
          variables: true,
        },
      ],
    },
  ],

  async run($) {
    const { boardId, groupId, itemName, subitemNames } = $.step.parameters;
    const allSubitems = subitemNames.map((entry) => entry.subitemName);

    const body = {
      query: `
        mutation {
            create_item (board_id: ${boardId}${
        groupId ? `, group_id: "${groupId}"` : ''
      }, item_name: "${itemName}") {
            id
        }
      }`,
    };

    const { data } = await $.http.post('/', body);

    const itemId = data.data.create_item.id;

    for (let subitemName of allSubitems) {
      let body = {
        query: `
          mutation {
            create_subitem (parent_item_id:${itemId}, item_name:"${subitemName}") {
              id
            }
          }`,
      };

      await $.http.post('/', body);
    }

    $.setActionItem({
      raw: data,
    });
  },
});
