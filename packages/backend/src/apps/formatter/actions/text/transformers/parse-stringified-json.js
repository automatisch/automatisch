const parseStringifiedJson = ($) => {
  const input = $.step.parameters.input;

  return JSON.parse(input);
};

export default parseStringifiedJson;
