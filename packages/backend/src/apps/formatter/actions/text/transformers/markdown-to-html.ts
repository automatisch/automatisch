import { IGlobalVariable } from '@automatisch/types';
import showdown from 'showdown';

const converter = new showdown.Converter();

const markdownToHtml = ($: IGlobalVariable) => {
  const input = $.step.parameters.input as string;

  const html = converter.makeHtml(input);
  return html;
};

export default markdownToHtml;
