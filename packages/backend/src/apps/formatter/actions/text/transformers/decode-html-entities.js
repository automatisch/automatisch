import he from 'he';

const decodeHtmlEntities = ($) => {
  const input = $.step.parameters.input;
  return he.decode(input);
};

export default decodeHtmlEntities;
