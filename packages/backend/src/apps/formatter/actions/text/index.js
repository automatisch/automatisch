import defineAction from '../../../../helpers/define-action.js';

import base64ToString from './transformers/base64-to-string.js';
import capitalize from './transformers/capitalize.js';
import extractEmailAddress from './transformers/extract-email-address.js';
import extractNumber from './transformers/extract-number.js';
import htmlToMarkdown from './transformers/html-to-markdown.js';
import lowercase from './transformers/lowercase.js';
import markdownToHtml from './transformers/markdown-to-html.js';
import pluralize from './transformers/pluralize.js';
import replace from './transformers/replace.js';
import stringToBase64 from './transformers/string-to-base64.js';
import trimWhitespace from './transformers/trim-whitespace.js';
import useDefaultValue from './transformers/use-default-value.js';

const transformers = {
  base64ToString,
  capitalize,
  extractEmailAddress,
  extractNumber,
  htmlToMarkdown,
  lowercase,
  markdownToHtml,
  pluralize,
  replace,
  stringToBase64,
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
      type: 'dropdown',
      required: true,
      variables: true,
      options: [
        { label: 'Base64 to String', value: 'base64ToString' },
        { label: 'Capitalize', value: 'capitalize' },
        { label: 'Convert HTML to Markdown', value: 'htmlToMarkdown' },
        { label: 'Convert Markdown to HTML', value: 'markdownToHtml' },
        { label: 'Extract Email Address', value: 'extractEmailAddress' },
        { label: 'Extract Number', value: 'extractNumber' },
        { label: 'Lowercase', value: 'lowercase' },
        { label: 'Pluralize', value: 'pluralize' },
        { label: 'Replace', value: 'replace' },
        { label: 'String to Base64', value: 'stringToBase64' },
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
    const transformerName = $.step.parameters.transform;
    const output = transformers[transformerName]($);

    $.setActionItem({
      raw: {
        output,
      },
    });
  },
});
