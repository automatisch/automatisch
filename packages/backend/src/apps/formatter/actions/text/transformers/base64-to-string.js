const base64ToString = ($) => {
  const input = $.step.parameters.input;
  const decodedString = Buffer.from(input, 'base64').toString('utf8');

  return decodedString;
};

export default base64ToString;
