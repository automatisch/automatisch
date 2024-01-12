import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Create database item',
  key: 'createDatabaseItem',
  description: 'Creates an item in a database.',
  arguments: [
    {
      label: 'Database',
      key: 'databaseId',
      type: 'dropdown',
      required: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listDatabases',
          },
        ],
      },
    },
    {
      label: 'Name',
      key: 'name',
      type: 'string',
      required: false,
      description:
        'This field has a 2000 character limit. Any characters beyond 2000 will not be included.',
      variables: true,
    },
    {
      label: 'Content',
      key: 'content',
      type: 'string',
      required: false,
      description:
        'The text to add to the page body. The max length for this field is 2000 characters. Any characters beyond 2000 will not be included.',
      variables: true,
    },
  ],

  async run($) {
    const name = $.step.parameters.name;
    const truncatedName = name.slice(0, 2000);
    const content = $.step.parameters.content;
    const truncatedContent = content.slice(0, 2000);

    const body = {
      parent: {
        database_id: $.step.parameters.databaseId,
      },
      properties: {},
      children: [],
    };

    if (name) {
      body.properties.Name = {
        title: [
          {
            text: {
              content: truncatedName,
            },
          },
        ],
      };
    }

    if (content) {
      body.children = [
        {
          object: 'block',
          paragraph: {
            rich_text: [
              {
                text: {
                  content: truncatedContent,
                },
              },
            ],
          },
        },
      ];
    }

    const { data } = await $.http.post('/v1/pages', body);

    $.setActionItem({
      raw: data,
    });
  },
});
