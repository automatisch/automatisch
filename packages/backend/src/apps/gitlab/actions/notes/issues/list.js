import defineAction from '../../../../../helpers/define-action.js';
import paginateAll from '../../../common/paginate-all.js';

export default defineAction({
  name: 'Issue: List Issue Notes',
  key: 'issueNotesList',
  description: 'Gets a list of all notes for a single issue.',
  arguments: [
    {
      label: 'Project ID',
      key: 'id',
      type: 'string',
      required: true,
      description: 'The global ID or URL-encoded path of the project.',
      variables: true,
    },
    {
      label: 'Issue Internal ID',
      key: 'issue_iid',
      type: 'integer',
      required: true,
      description: "The internal ID of a project's issue.",
      variables: true,
    },
    {
      label: 'Sort',
      key: 'sort',
      type: 'dropdown',
      required: false,
      description:
        'Return issue notes sorted in `asc` or `desc` order. Default is `desc`.',
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
    const { id, issue_iid, ...params } = $.step.parameters;

    let response = await $.http.get(
      `/api/v4/projects/${encodeURI(id)}/issues/${issue_iid}/notes`,
      {
        params,
      }
    );
    response = paginateAll($, response);

    $.setActionItem({ raw: response.data });
  },
});
