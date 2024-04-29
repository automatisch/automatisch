const replaceWithRegEx = ($) => {
  const input = $.step.parameters.input;

  const find = new RegExp($.step.parameters.find);
  const replace = $.step.parameters.replace;

  return input.replace(find, replace);
};

export default replaceWithRegEx;
