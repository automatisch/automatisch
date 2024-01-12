import { NodeHtmlMarkdown } from 'node-html-markdown';

const htmlToMarkdown = ($) => {
  const input = $.step.parameters.input;

  const markdown = NodeHtmlMarkdown.translate(input);
  return markdown;
};

export default htmlToMarkdown;
