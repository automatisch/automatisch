import defineAction from '../../../../../helpers/define-action.js';

export default defineAction({
  name: 'Snippet: Modify Snippet Note',
  key: 'snippetNoteModify',
  description: 'Modifies an existing note of a snippet.',
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
      description: 'The ID of a snippet note.',
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
  ],

  async run($) {
    const { id, snippet_id, note_id, ...params } = $.step.parameters;

    const response = await $.http.put(
      `/api/v4/projects/${encodeURI(
        id
      )}/snippets/${snippet_id}/notes/${note_id}`,
      {
        params,
      }
    );

    $.setActionItem({ raw: response.data });
  },
});
