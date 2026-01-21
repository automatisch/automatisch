import defineAction from '../../../../helpers/define-action.js';

import compare from './transformers/compare.js';
import compareMerge from './transformers/compare-merge.js';

const transformers = {
  compare,
  compareMerge,
};

export default defineAction({
  name: 'Lists',
  key: 'lists',
  description:
    'Transform list data by comparing two lists matching on a specified field',
  arguments: [
    {
      label: 'Transform',
      key: 'transform',
      type: 'dropdown',
      required: true,
      variables: false,
      options: [
        { label: 'Compare Lists', value: 'compare' },
        { label: 'Compare & Merge Lists', value: 'compareMerge' },
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
