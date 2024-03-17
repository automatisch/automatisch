import defineAction from '../../../../../helpers/define-action.js';

export default defineAction({
  name: 'Merge Request: Get a single Merge Request Note',
  key: 'mergeRequestNoteGet',
  description: 'Returns a single note for a given merge request.',
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
      description: 'The IID of a project merge request.',
      variables: true,
    },
    {
      label: 'Note ID',
      key: 'note_id',
      type: 'integer',
      required: true,
      description: 'The ID of a merge request note.',
      variables: true,
    },
  ],

  async run($) {
    const { id, merge_request_iid, note_id } = $.step.parameters;

    const response = await $.http.get(
      `/api/v4/projects/${encodeURI(
        id
      )}/merge_requests/${merge_request_iid}/notes/${note_id}`
    );

    $.setActionItem({ raw: response.data });
  },
});
