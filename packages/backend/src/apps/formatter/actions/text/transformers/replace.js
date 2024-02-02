const replace = ($) => {
  const input = $.step.parameters.input;

  const find = $.step.parameters.find;
  const replace = $.step.parameters.replace;

  return input.replaceAll(find, replace);
};

export default replace;
