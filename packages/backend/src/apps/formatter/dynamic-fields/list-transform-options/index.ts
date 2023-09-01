import { IGlobalVariable, IJSONObject } from '@automatisch/types';
import capitalize from './options/capitalize';
import extractEmailAddress from './options/extract-email-address';
import extractNumber from './options/extract-number';
import htmlToMarkdown from './options/html-to-markdown';
import lowercase from './options/lowercase';
import markdownToHtml from './options/markdown-to-html';
import pluralize from './options/pluralize';
import replace from './options/replace';
import trimWhitespace from './options/trim-whitespace';
import useDefaultValue from './options/use-default-value';

const options: IJSONObject = {
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

export default {
  name: 'List fields after transform',
  key: 'listTransformOptions',

  async run($: IGlobalVariable) {
    return options[$.step.parameters.transform as string];
  },
};
