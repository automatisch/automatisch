const extractNumber = ($) => {
  const input = $.step.parameters.input;

  //  Example numbers that's supported:
  //  123
  //  -123
  //  123456
  //  -123456
  //  121,234
  //  -121,234
  //  121.234
  //  -121.234
  //  1,234,567.89
  //  -1,234,567.89
  //  1.234.567,89
  //  -1.234.567,89

  const numberRegexp = /-?((\d{1,3})+\.?,?)+/g;

  const numbers = input.match(numberRegexp);
  return numbers ? numbers[0] : '';
};

export default extractNumber;
