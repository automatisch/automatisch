import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Create page',
  key: 'createPage',
  description: 'Creates a page inside a parent page',
  arguments: [
    {
      label: 'Parent page',
      key: 'parentPageId',
      type: 'dropdown',
      required: true,
      variables: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listParentPages',
          },
        ],
      },
    },
    {
      label: 'Title',
      key: 'title',
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
    const parentPageId = $.step.parameters.parentPageId;
    const title = $.step.parameters.title;
    const truncatedTitle = title.slice(0, 2000);
    const content = $.step.parameters.content;
    const truncatedContent = content.slice(0, 2000);

    const body = {
      parent: {
        page_id: parentPageId,
      },
      properties: {},
      children: [],
    };

    if (title) {
      body.properties.title = {
        type: 'title',
        title: [
          {
            text: {
              content: truncatedTitle,
            },
          },
        ],
      };
    }

    if (content) {
      body.children = [
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
      ];
    }

    const { data } = await $.http.post('/v1/pages', body);

    $.setActionItem({
      raw: data,
    });
  },
});
