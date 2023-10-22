import { IGlobalVariable, IJSONObject } from '@automatisch/types';
import capitalize from './text/capitalize';
import extractEmailAddress from './text/extract-email-address';
import extractNumber from './text/extract-number';
import htmlToMarkdown from './text/html-to-markdown';
import lowercase from './text/lowercase';
import markdownToHtml from './text/markdown-to-html';
import pluralize from './text/pluralize';
import replace from './text/replace';
import trimWhitespace from './text/trim-whitespace';
import useDefaultValue from './text/use-default-value';
import performMathOperation from './numbers/perform-math-operation';
import randomNumber from './numbers/random-number';
import formatNumber from './numbers/format-number';
import formatPhoneNumber from './numbers/format-phone-number';
import formatDateTime from './date-time/format-date-time';

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
  performMathOperation,
  randomNumber,
  formatNumber,
  formatPhoneNumber,
  formatDateTime,
};

export default {
  name: 'List fields after transform',
  key: 'listTransformOptions',

  async run($: IGlobalVariable) {
    return options[$.step.parameters.transform as string];
  },
};
