import { IGlobalVariable, IJSONObject } from '@automatisch/types';
import capitalize from './options/capitalize';
import htmlToMarkdown from './options/html-to-markdown';
import markdownToHtml from './options/markdown-to-html';
import useDefaultValue from './options/use-default-value';
import extractEmailAddress from './options/extract-email-address';

const options: IJSONObject = {
  capitalize,
  htmlToMarkdown,
  markdownToHtml,
  useDefaultValue,
  extractEmailAddress,
};

export default {
  name: 'List fields after transform',
  key: 'listTransformOptions',

  async run($: IGlobalVariable) {
    return options[$.step.parameters.transform as string];
  },
};
