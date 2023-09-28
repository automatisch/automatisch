import defineAction from '../../../../helpers/define-action';

import findArrayItemByProperty from './transformers/find-array-item-by-property';

const transformers = {
  findArrayItemByProperty,
};

export default defineAction({
  name: 'Utilities',
  key: 'utilities',
  description: 'Specific utilities to help you transform your data.',
  arguments: [
    {
      label: 'Transform',
      key: 'transform',
      type: 'dropdown' as const,
      required: true,
      variables: true,
      options: [
        {
          label: 'Find Array Item By Property',
          value: 'findArrayItemByProperty',
        },
      ],
      additionalFields: {
        type: 'query',
        name: 'getDynamicFields',
        arguments: [
          {
            name: 'key',
            value: 'listTransformOptions',
          },
          {
            name: 'parameters.transform',
            value: '{parameters.transform}',
          },
        ],
      },
    },
  ],

  async run($) {
    const transformerName = $.step.parameters
      .transform as keyof typeof transformers;
    const output = transformers[transformerName]($);

    $.setActionItem({
      raw: {
        output,
      },
    });
  },
});
