import { IGlobalVariable } from '@automatisch/types';
import { NodeHtmlMarkdown } from 'node-html-markdown';

const htmlToMarkdown = ($: IGlobalVariable) => {
  const input = $.step.parameters.input as string;

  const markdown = NodeHtmlMarkdown.translate(input);
  return markdown;
};

export default htmlToMarkdown;
