import pluralizeLibrary from 'pluralize';

const pluralize = ($) => {
  const input = $.step.parameters.input;
  return pluralizeLibrary(input);
};

export default pluralize;
