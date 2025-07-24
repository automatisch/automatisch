import defineAction from '../../../../../helpers/define-action.js';
import paginateAll from '../../../common/paginate-all.js';

export default defineAction({
  name: 'Snippet: List Snippet Notes',
  key: 'snippetNotesList',
  description: 'Gets a list of all notes for a single snippet.',
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
        'Return snippet notes ordered by created_at or updated_at fields.',
      value: 'created_at',
      options: [
        { label: 'Created At', value: 'created_at' },
        { label: 'Updated At', value: 'updated_at' },
      ],
    },
  ],

  async run($) {
    const { id, snippet_id, ...params } = $.step.parameters;

    let response = await $.http.get(
      `/api/v4/projects/${encodeURI(id)}/snippets/${snippet_id}/notes`,
      {
        params,
      }
    );
    response = paginateAll($, response);

    $.setActionItem({ raw: response.data });
  },
});
