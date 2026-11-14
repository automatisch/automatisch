import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Best providers for an API',
  key: 'bestForApi',
  description: 'Gets the providers Datacircle scores highest for one API.',
  arguments: [
    {
      label: 'API slug',
      key: 'slug',
      type: 'string',
      required: true,
      variables: true,
      description: 'The slug of an API, as listed by the List APIs action.',
    },
    {
      label: 'Limit',
      key: 'limit',
      type: 'string',
      required: false,
      variables: true,
      description: 'How many providers to return.',
    },
  ],

  async run($) {
    const slug = encodeURIComponent($.step.parameters.slug);
    const params = {};

    if ($.step.parameters.limit) {
      params.limit = $.step.parameters.limit;
    }

    const { data } = await $.http.get(
      `https://api.datacircle.dev/v1/apis/${slug}/best`,
      { params }
    );

    $.setActionItem({
      raw: data,
    });
  },
});
