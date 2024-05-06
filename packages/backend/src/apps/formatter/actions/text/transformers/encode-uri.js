const encodeUri = ($) => {
  const input = $.step.parameters.input;
  const encodedString = encodeURI(input);

  return encodedString;
};

export default encodeUri;
