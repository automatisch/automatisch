import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Delay until',
  key: 'delayUntil',
  description:
    'Delays the execution of the next action until a specified date.',
  arguments: [
    {
      label: 'Delay until (Date)',
      key: 'delayUntil',
      type: 'string',
      required: true,
      description: 'Delay until the date. E.g. 2022-12-18',
      variables: true,
    },
  ],

  async run($) {
    const { delayUntil } = $.step.parameters;

    const dataItem = {
      delayUntil,
    };

    $.setActionItem({ raw: dataItem });
  },
});
