import { IGlobalVariable, IJSONObject } from '@automatisch/types';
import capitalize from './options/capitalize';
import htmlToMarkdown from './options/html-to-markdown';
import markdownToHtml from './options/markdown-to-html';
import useDefaultValue from './options/use-default-value';
import extractEmailAddress from './options/extract-email-address';
import extractNumber from './options/extract-number';
import lowercase from './options/lowercase';

const options: IJSONObject = {
  capitalize,
  htmlToMarkdown,
  markdownToHtml,
  useDefaultValue,
  extractEmailAddress,
  extractNumber,
  lowercase,
};

export default {
  name: 'List fields after transform',
  key: 'listTransformOptions',

  async run($: IGlobalVariable) {
    return options[$.step.parameters.transform as string];
  },
};
