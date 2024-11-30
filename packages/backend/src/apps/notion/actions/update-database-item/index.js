import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Update database item',
  key: 'updateDatabaseItem',
  description: 'Updates a database item.',
  arguments: [
    {
      label: 'Database',
      key: 'databaseId',
      type: 'dropdown',
      required: true,
      variables: true,
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
      label: 'Item',
      key: 'itemId',
      type: 'dropdown',
      required: true,
      variables: true,
      dependsOn: ['parameters.databaseId'],
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listDatabaseItems',
          },
          {
            name: 'parameters.databaseId',
            value: '{parameters.databaseId}',
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
          required: true,
          variables: true,
          dependsOn: ['parameters.databaseId'],
          source: {
            type: 'query',
            name: 'getDynamicData',
            arguments: [
              {
                name: 'key',
                value: 'listTags',
              },
              {
                name: 'parameters.databaseId',
                value: '{parameters.databaseId}',
              },
            ],
          },
        },
      ],
    },
    {
      label: 'Content',
      key: 'content',
      type: 'string',
      required: false,
      description:
        'You can choose to add extra text to the database item, with a limit of up to 2000 characters if desired.',
      variables: true,
    },
  ],

  async run($) {
    const itemId = $.step.parameters.itemId;
    const name = $.step.parameters.name;
    const truncatedName = name.slice(0, 2000);
    const content = $.step.parameters.content;
    const truncatedContent = content.slice(0, 2000);
    const tags = $.step.parameters.tags;
    const formattedTags = tags
      .filter((tag) => tag.tag !== '')
      .map((tag) => tag.tag);

    const body = {
      properties: {},
    };

    if (truncatedName) {
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

    if (formattedTags?.length) {
      body.properties.Tags = {
        multi_select: formattedTags.map((tag) => ({ name: tag })),
      };
    }

    if (truncatedContent) {
      const response = await $.http.get(`/v1/blocks/${itemId}/children`);
      const firstBlockId = response.data.results[0].id;

      const body = {
        paragraph: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: truncatedContent,
              },
            },
          ],
        },
      };

      await $.http.patch(`/v1/blocks/${firstBlockId}`, body);
    }

    const { data } = await $.http.patch(`/v1/pages/${itemId}`, body);

    $.setActionItem({
      raw: data,
    });
  },
});
