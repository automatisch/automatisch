const stringtoBase64 = ($) => {
  const input = $.step.parameters.input;
  const base64String = Buffer.from(input).toString('base64');

  return base64String;
};

export default stringtoBase64;
