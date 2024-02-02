import showdown from 'showdown';

const converter = new showdown.Converter();

const markdownToHtml = ($) => {
  const input = $.step.parameters.input;

  const html = converter.makeHtml(input);
  return html;
};

export default markdownToHtml;
