import { IGlobalVariable, IJSONObject } from '@automatisch/types';
import capitalize from './text/capitalize';
import extractEmailAddress from './text/extract-email-address';
import extractNumber from './text/extract-number';
import findArrayItemByProperty from './utilities/find-array-item-by-property';
import formatDateTime from './date-time/format-date-time';
import formatNumber from './numbers/format-number';
import htmlToMarkdown from './text/html-to-markdown';
import lowercase from './text/lowercase';
import markdownToHtml from './text/markdown-to-html';
import performMathOperation from './numbers/perform-math-operation';
import pluralize from './text/pluralize';
import randomNumber from './numbers/random-number';
import replace from './text/replace';
import trimWhitespace from './text/trim-whitespace';
import useDefaultValue from './text/use-default-value';

const options: IJSONObject = {
  capitalize,
  extractEmailAddress,
  extractNumber,
  findArrayItemByProperty,
  formatDateTime,
  formatNumber,
  htmlToMarkdown,
  lowercase,
  markdownToHtml,
  performMathOperation,
  pluralize,
  randomNumber,
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
