import defineAction from '../../../../helpers/define-action.js';

import performMathOperation from './transformers/perform-math-operation.js';
import randomNumber from './transformers/random-number.js';
import formatNumber from './transformers/format-number.js';
import formatPhoneNumber from './transformers/format-phone-number.js';

const transformers = {
  performMathOperation,
  randomNumber,
  formatNumber,
  formatPhoneNumber,
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
      type: 'dropdown',
      required: true,
      variables: true,
      options: [
        { label: 'Perform Math Operation', value: 'performMathOperation' },
        { label: 'Random Number', value: 'randomNumber' },
        { label: 'Format Number', value: 'formatNumber' },
        { label: 'Format Phone Number', value: 'formatPhoneNumber' },
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
    const transformerName = $.step.parameters.transform;
    const output = transformers[transformerName]($);

    $.setActionItem({
      raw: {
        output,
      },
    });
  },
});
