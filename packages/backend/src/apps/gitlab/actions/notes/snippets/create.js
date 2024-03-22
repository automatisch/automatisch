import defineAction from '../../../../../helpers/define-action.js';

export default defineAction({
  name: 'Snippet: Create a new Snippet Note',
  key: 'snippetNoteCreate',
  description: 'Creates a new note for a single snippet.',
  arguments: [
    {
      label: 'Project ID',
      key: 'id',
      type: 'string',
      required: true,
      description: 'The ID or path of the project.',
      variables: true,
    },
    {
      label: 'Snippet ID',
      key: 'snippet_id',
      type: 'integer',
      required: true,
      description: 'The ID of a snippet.',
      variables: true,
    },
    {
      label: 'Body',
      key: 'body',
      type: 'string',
      required: true,
      description: 'The content of the note. Limited to 1,000,000 characters.',
      variables: true,
    },
    {
      label: 'Created At',
      key: 'created_at',
      type: 'string',
      required: false,
      description:
        'Date time string, ISO 8601 formatted. Example: `2011-11-03T09:00:00Z` (requires administrator or project/group owner rights)',
      variables: true,
    },
  ],

  async run($) {
    const { id, snippet_id, body, created_at } = $.step.parameters;

    const response = await $.http.post(
      `/api/v4/projects/${encodeURI(id)}/snippets/${snippet_id}/notes`,
      {
        body,
        created_at,
      }
    );

    $.setActionItem({ raw: response.data });
  },
});
