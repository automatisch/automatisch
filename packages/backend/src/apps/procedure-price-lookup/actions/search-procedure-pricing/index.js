import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Search Procedure Pricing',
  key: 'searchProcedurePricing',
  description: 'search procedure pricing by given parent code.',
  arguments: [
    {
      label: 'Code',
      key: 'code',
      type: 'string',
      required: true,
      variables: true,
      description: 'The code to find cost values for.',
    },
  ],

  async run($) {
    const code = $.step.parameters.code;
    const { data } = await $.http.get(`/costs/${code}`);
    $.setActionItem({ raw: data });
  },
});
