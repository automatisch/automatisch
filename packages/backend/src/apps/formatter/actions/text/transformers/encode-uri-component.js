const encodeUriComponent = ($) => {
  const input = $.step.parameters.input;
  const encodedString = encodeURIComponent(input);

  return encodedString;
};

export default encodeUriComponent;
