const stringifyJson = ($) => {
  const input = $.step.parameters.input;

  return JSON.stringify(input);
};

export default stringifyJson;
