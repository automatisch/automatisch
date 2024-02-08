import defineAction from '../../../../../helpers/define-action.js';
import paginateAll from '../../../common/paginate-all.js';

export default defineAction({
  name: 'List Merge Request Notes',
  key: 'mergeRequestNotesList',
  description: 'Gets a list of all notes for a single merge request.',
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
      type: 'string',
      required: true,
      description: 'The IID of a project merge request.',
      variables: true,
    },
    {
      label: 'Sort',
      key: 'sort',
      type: 'dropdown',
      required: false,
      description:
        'Return snippet notes sorted in ascending or descending order.',
      value: 'desc',
      options: [
        { label: 'Ascending', value: 'asc' },
        { label: 'Descending', value: 'desc' },
      ],
    },
    {
      label: 'Order By',
      key: 'order_by',
      type: 'dropdown',
      required: false,
      description:
        'Return issue notes ordered by `created_at` or `updated_at` fields. Default is `created_at`.',
      value: 'created_at',
      options: [
        { label: 'Created At', value: 'created_at' },
        { label: 'Updated At', value: 'updated_at' },
      ],
    },
  ],

  async run($) {
    const { id, merge_request_iid, ...params } = $.step.parameters;

    let response = await $.http.get(
      `/api/v4/projects/${encodeURI(
        id
      )}/merge_requests/${merge_request_iid}/notes`,
      {
        params,
      }
    );
    response = paginateAll($, response);

    $.setActionItem({ raw: response.data });
  },
});
