import defineAction from '../../../../../helpers/define-action.js';

export default defineAction({
  name: 'Snippet: Delete a Snippet Note',
  key: 'snippetNoteDelete',
  description: 'Deletes an existing note of a snippet.',
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
      label: 'Note ID',
      key: 'note_id',
      type: 'integer',
      required: true,
      description: 'The ID of a note.',
      variables: true,
    },
  ],

  async run($) {
    const { id, snippet_id, note_id } = $.step.parameters;

    const response = await $.http.delete(
      `/api/v4/projects/${encodeURI(
        id
      )}/snippets/${snippet_id}/notes/${note_id}`
    );

    $.setActionItem({ raw: response.data });
  },
});
