import defineAction from '../../../../helpers/define-action';

import capitalize from './transformers/capitalize';
import extractEmailAddress from './transformers/extract-email-address';
import extractNumber from './transformers/extract-number';
import htmlToMarkdown from './transformers/html-to-markdown';
import lowercase from './transformers/lowercase';
import markdownToHtml from './transformers/markdown-to-html';
import pluralize from './transformers/pluralize';
import replace from './transformers/replace';
import trimWhitespace from './transformers/trim-whitespace';
import useDefaultValue from './transformers/use-default-value';

const transformers = {
  capitalize,
  extractEmailAddress,
  extractNumber,
  htmlToMarkdown,
  lowercase,
  markdownToHtml,
  pluralize,
  replace,
  trimWhitespace,
  useDefaultValue,
};

export default defineAction({
  name: 'Text',
  key: 'text',
  description:
    'Transform text data to capitalize, extract emails, apply default value, and much more.',
  arguments: [
    {
      label: 'Transform',
      key: 'transform',
      type: 'dropdown' as const,
      required: true,
      variables: true,
      options: [
        { label: 'Capitalize', value: 'capitalize' },
        { label: 'Convert HTML to Markdown', value: 'htmlToMarkdown' },
        { label: 'Convert Markdown to HTML', value: 'markdownToHtml' },
        { label: 'Extract Email Address', value: 'extractEmailAddress' },
        { label: 'Extract Number', value: 'extractNumber' },
        { label: 'Lowercase', value: 'lowercase' },
        { label: 'Pluralize', value: 'pluralize' },
        { label: 'Replace', value: 'replace' },
        { label: 'Trim Whitespace', value: 'trimWhitespace' },
        { label: 'Use Default Value', value: 'useDefaultValue' },
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
