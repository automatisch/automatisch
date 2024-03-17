import defineAction from '../../../../../helpers/define-action.js';

export default defineAction({
  name: 'Snippet: Get Single Snippet Note',
  key: 'snippetNoteGet',
  description: 'Returns a single note for a given snippet.',
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
      description: 'The ID of a project snippet.',
      variables: true,
    },
    {
      label: 'Note ID',
      key: 'note_id',
      type: 'integer',
      required: true,
      description: 'The ID of a snippet note.',
      variables: true,
    },
  ],

  async run($) {
    const { id, snippet_id, note_id } = $.step.parameters;

    const response = await $.http.get(
      `/api/v4/projects/${encodeURI(
        id
      )}/snippets/${snippet_id}/notes/${note_id}`
    );

    $.setActionItem({ raw: response.data });
  },
});
