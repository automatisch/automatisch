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
      additionalFields: {
        type: 'query',
        name: 'getDynamicFields',
        arguments: [
          {
            name: 'key',
            value: 'listDatabaseProperties',
          },
          {
            name: 'parameters.databaseId',
            value: '{parameters.databaseId}',
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
    const databaseId = $.step.parameters.databaseId;
    const content = $.step.parameters.content;

    // Get database schema to understand property types
    const databaseResponse = await $.http.get(`/v1/databases/${databaseId}`);
    const databaseProperties = databaseResponse.data.properties;

    const body = {
      properties: {},
    };

    // Process dynamic properties from step parameters
    for (const [key, value] of Object.entries($.step.parameters)) {
      if (!key.startsWith('property_') || !value) continue;

      const propertyName = key.replace('property_', '');
      const propertyConfig = databaseProperties[propertyName];

      if (!propertyConfig) continue;

      const propertyType = propertyConfig.type;

      switch (propertyType) {
        case 'title':
          body.properties[propertyName] = {
            title: [
              {
                text: {
                  content: String(value).slice(0, 2000),
                },
              },
            ],
          };
          break;

        case 'rich_text':
          body.properties[propertyName] = {
            rich_text: [
              {
                text: {
                  content: String(value).slice(0, 2000),
                },
              },
            ],
          };
          break;

        case 'number': {
          const numValue = parseFloat(value);
          if (!isNaN(numValue)) {
            body.properties[propertyName] = {
              number: numValue,
            };
          }
          break;
        }

        case 'checkbox':
          body.properties[propertyName] = {
            checkbox: value === 'true' || value === true,
          };
          break;

        case 'select':
          body.properties[propertyName] = {
            select: {
              name: String(value),
            },
          };
          break;

        case 'multi_select':
          if (Array.isArray(value)) {
            body.properties[propertyName] = {
              multi_select: value
                .filter((item) => item.option)
                .map((item) => ({ name: item.option })),
            };
          }
          break;

        case 'date':
          body.properties[propertyName] = {
            date: {
              start: String(value),
            },
          };
          break;

        case 'people':
          if (Array.isArray(value)) {
            body.properties[propertyName] = {
              people: value
                .filter((item) => item.userId)
                .map((item) => ({
                  object: 'user',
                  id: item.userId,
                })),
            };
          }
          break;

        case 'files':
          if (Array.isArray(value)) {
            body.properties[propertyName] = {
              files: value
                .filter((item) => item.url)
                .map((item) => ({
                  name: item.name || 'File',
                  external: {
                    url: item.url,
                  },
                })),
            };
          }
          break;

        case 'relation':
          if (Array.isArray(value)) {
            body.properties[propertyName] = {
              relation: value
                .filter((item) => item.pageId)
                .map((item) => ({ id: item.pageId })),
            };
          }
          break;

        case 'email':
          body.properties[propertyName] = {
            email: String(value),
          };
          break;

        case 'phone_number':
          body.properties[propertyName] = {
            phone_number: String(value),
          };
          break;

        case 'url':
          body.properties[propertyName] = {
            url: String(value),
          };
          break;
      }
    }

    // Handle content update if provided
    if (content) {
      const truncatedContent = String(content).slice(0, 2000);
      const response = await $.http.get(`/v1/blocks/${itemId}/children`);

      if (response.data.results?.length > 0) {
        const firstBlock = response.data.results[0];
        const firstBlockId = firstBlock.id;
        const firstBlockType = firstBlock.type;

        // Handle different block types appropriately
        let blockBody;

        if (firstBlockType === 'paragraph') {
          // Update existing paragraph
          blockBody = {
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
          await $.http.patch(`/v1/blocks/${firstBlockId}`, blockBody);
        } else if (
          ['heading_1', 'heading_2', 'heading_3'].includes(firstBlockType)
        ) {
          // Update heading with the same type
          blockBody = {
            [firstBlockType]: {
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
          await $.http.patch(`/v1/blocks/${firstBlockId}`, blockBody);
        } else {
          // For other block types, append a new paragraph block
          const appendBody = {
            children: [
              {
                object: 'block',
                type: 'paragraph',
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
              },
            ],
          };
          await $.http.patch(`/v1/blocks/${itemId}/children`, appendBody);
        }
      } else {
        // No existing blocks, create a new paragraph block
        const appendBody = {
          children: [
            {
              object: 'block',
              type: 'paragraph',
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
            },
          ],
        };
        await $.http.patch(`/v1/blocks/${itemId}/children`, appendBody);
      }
    }

    const { data } = await $.http.patch(`/v1/pages/${itemId}`, body);

    $.setActionItem({
      raw: data,
    });
  },
});
