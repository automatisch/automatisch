import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  arguments: [
    {
      description: 'The phone numbers for looking up, separated by commas.',
      key: 'numbers',
      label: 'Numbers',
      required: true,
      type: 'string',
      variables: true,
    },
    {
      description: 'The type of lookup to perform.',
      key: 'type',
      label: 'Type',
      options: [
        {
          label: 'CNAM',
          value: 'cnam',
        },
        {
          label: 'Format',
          value: 'format',
        },
        {
          label: 'HLR',
          value: 'hlr',
        },
        {
          label: 'MNP',
          value: 'mnp',
        },
        {
          label: 'RCS',
          value: 'rcs',
        },
      ],
      required: true,
      type: 'dropdown',
    },
  ],
  description: 'Perform phone number lookups',
  key: 'lookup',
  name: 'Lookup',

  async run($) {
    const {numbers, type} = $.step.parameters
    const response = await $.http.get(`/lookup/${type}?number=${numbers}`);

    $.setActionItem({ raw: response.data });
  },
});
