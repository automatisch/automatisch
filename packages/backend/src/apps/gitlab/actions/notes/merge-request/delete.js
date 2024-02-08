import defineAction from '../../../../../helpers/define-action.js';

export default defineAction({
  name: 'Delete Merge Request Note',
  key: 'mergeRequestNoteDelete',
  description: 'Deletes an existing note of a merge request.',
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
      label: 'Merge Request IID',
      key: 'merge_request_iid',
      type: 'integer',
      required: true,
      description: 'The IID of a merge request.',
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
    const { id, merge_request_iid, note_id } = $.step.parameters;

    const response = await $.http.delete(
      `/api/v4/projects/${encodeURI(
        id
      )}/merge_requests/${merge_request_iid}/notes/${note_id}`
    );

    $.setActionItem({ raw: response.data });
  },
});
