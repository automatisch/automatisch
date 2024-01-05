import lodashCapitalize from 'lodash/capitalize.js';

const capitalize = ($) => {
  const input = $.step.parameters.input;
  const capitalizedInput = input.replace(/\w+/g, lodashCapitalize);

  return capitalizedInput;
};

export default capitalize;
