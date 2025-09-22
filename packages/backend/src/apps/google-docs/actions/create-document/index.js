import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Create document',
  key: 'createDocument',
  description:
    'Create a blank Google Doc or duplicate an existing document. Optionally, provide initial content.',
  arguments: [
    {
      label: 'Title',
      key: 'title',
      type: 'string',
      required: true,
      description: 'The title of the new document.',
      variables: true,
    },
    {
      label: 'Content',
      key: 'content',
      type: 'string',
      required: false,
      description: 'Optional text to insert into the new document.',
      variables: true,
    },
  ],

  async run($) {
    // Create a blank Google Doc
    const fileMetadata = {
      name: $.step.parameters.title,
      mimeType: 'application/vnd.google-apps.document',
    };

    const { data } = await $.http.post(
      'https://www.googleapis.com/drive/v3/files',
      fileMetadata
    );

    // If initial content is provided, insert it
    if ($.step.parameters.content) {
      await $.http.post(
        `/v1/documents/${data.id}:batchUpdate`,
        {
          requests: [
            {
              insertText: {
                location: { index: 1 },
                text: $.step.parameters.content,
              },
            },
          ],
        }
      );
    }

    $.setActionItem({
      raw: data,
    });
  },
});
