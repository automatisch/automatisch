import defineAction from '../../../../helpers/define-action';

import performMathOperation from './transformers/perform-math-operation';

const transformers = {
  performMathOperation,
};

export default defineAction({
  name: 'Numbers',
  key: 'numbers',
  description:
    'Transform numbers to perform math operations, generate random numbers, format numbers, and much more.',
  arguments: [
    {
      label: 'Transform',
      key: 'transform',
      type: 'dropdown' as const,
      required: true,
      variables: true,
      options: [
        { label: 'Perform Math Operation', value: 'performMathOperation' },
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
